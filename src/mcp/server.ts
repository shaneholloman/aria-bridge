import { Server } from '@modelcontextprotocol/sdk/server';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import type { BridgeEvent } from '../types';
import { resolveMcpConfig } from './config';
import { EventBuffer } from './event-buffer';
import { HostConsumer } from './consumer';
import { projectMetadata, projectStats, toJsonContent } from './mappers';
import type { McpOptions } from './types';
import { KNOWN_RESOURCES } from './types';
import { validateControlArgs, validateSubscribeArgs } from './validation';

import { getEnv } from '../platform';

const VERSION = getEnv('npm_package_version') || '0.0.0';

export interface McpServer {
  stop: () => Promise<void>;
}

export async function startMcpServer(options: McpOptions = {}): Promise<McpServer> {
  const config = resolveMcpConfig(options);
  const consumer = new HostConsumer(config.meta, config.clientId, config.debug);

  // Track connection state
  let connected = false;

  // Try to connect, but don't fail if host isn't available
  try {
    await consumer.connect();
    await consumer.subscribe({
      type: 'subscribe',
      levels: config.subscription.levels,
      capabilities: config.subscription.capabilities,
      llm_filter: config.subscription.llm_filter,
    });
    connected = true;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (config.debug) {
      // eslint-disable-next-line no-console
      console.error(`[aria-bridge-mcp] Could not connect to bridge host: ${message}`);
      // eslint-disable-next-line no-console
      console.error('[aria-bridge-mcp] MCP server starting anyway - tools will return errors until host is available');
    }
  }

  const buffer = new EventBuffer(config.bufferSize);

  const server = new Server({
    name: 'aria-bridge-mcp',
    version: VERSION,
  }, {
    capabilities: {
      resources: { subscribe: true },
      tools: {},
    },
  });

  // Event forwarding (only when connected)
  if (connected) {
    consumer.on('bridge-event', (event: BridgeEvent) => {
      buffer.push(event);
      server.notification({ method: 'bridge/event', params: event as any });
      notifyResourceUpdates(server, event.type);
    });

    // Control results back to tools
    consumer.on('control-result', (result) => {
      server.notification({ method: 'bridge/control_result', params: result as any });
    });
  }

  server.setRequestHandler(ListResourcesRequestSchema, async () => ({
    resources: resourceList(),
  }));

  server.setRequestHandler(ReadResourceRequestSchema, async (req) => {
    const uri = req.params.uri;

    // Metadata is always available even when not connected
    if (uri === 'bridge://metadata') {
      const meta = projectMetadata(config.meta);
      // Add connection status to metadata
      if (!connected) {
        meta.contents[0].text = JSON.stringify({
          ...JSON.parse(meta.contents[0].text),
          connected: false,
          message: `Bridge host not available at ${config.meta.url}. MCP server is running but cannot receive events.`,
        }, null, 2);
      } else {
        meta.contents[0].text = JSON.stringify({
          ...JSON.parse(meta.contents[0].text),
          connected: true,
        }, null, 2);
      }
      return meta;
    }

    // Other resources require connection
    if (!connected) {
      return toJsonContent(uri, {
        error: 'Bridge host not available',
        message: `Ensure a browser or app with @shaneholloman/aria-bridge is running on ${config.meta.url}`,
      });
    }

    switch (uri) {
      case 'bridge://events/recent':
        return toJsonContent(uri, buffer.recent());
      case 'bridge://events/errors':
        return toJsonContent(uri, buffer.errors());
      case 'bridge://events/network':
        return toJsonContent(uri, buffer.network());
      case 'bridge://events/navigation':
        return toJsonContent(uri, buffer.navigation());
      case 'bridge://events/screenshot': {
        const latest = buffer.latestScreenshot();
        return toJsonContent(uri, latest ? latest : { message: 'No screenshots captured yet' });
      }
      case 'bridge://stats':
        return projectStats(buffer.recent());
      default:
        throw new Error(`Unknown resource uri: ${uri}`);
    }
  });

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: 'subscribe_to_events',
        description: 'Update host subscription levels/capabilities/llm_filter',
        inputSchema: {
          type: 'object',
          properties: {
            levels: { type: 'array', items: { type: 'string' } },
            capabilities: { type: 'array', items: { type: 'string' } },
            llm_filter: { type: 'string' },
          },
        },
      },
      {
        name: 'send_control',
        description: 'Forward a control request to connected bridges',
        inputSchema: {
          type: 'object',
          properties: {
            action: { type: 'string' },
            args: { type: 'object' },
            code: { type: 'string' },
            timeoutMs: { type: 'number' },
            expectResult: { type: 'boolean' },
          },
          required: ['action'],
        },
      },
    ],
  }));

  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const { name, arguments: args } = req.params;

    // Check if connected before allowing tool calls
    if (!connected) {
      const errorMsg = `Bridge host not available. Ensure a browser or app with @shaneholloman/aria-bridge is running on ${config.meta.url}`;
      return {
        content: [{ type: 'text', text: errorMsg }],
        isError: true,
      };
    }

    if (name === 'subscribe_to_events') {
      const parsed = validateSubscribeArgs(args);
      await consumer.subscribe({ type: 'subscribe', ...parsed });
      return { content: [{ type: 'text', text: 'subscription updated' }] };
    }
    if (name === 'send_control') {
      const parsed = validateControlArgs(args);
      const id = `mcp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const result = await consumer.sendControl(id, parsed.action, parsed.args ?? parsed.code, parsed.timeoutMs);
      return { content: [{ type: 'text', text: JSON.stringify(result) }] };
    }
    throw new Error(`Unknown tool: ${name}`);
  });

  const transport = (options.transport as any) || new StdioServerTransport();
  await server.connect(transport);

  const stop = async () => {
    consumer.close();
    await server.close();
  };

  return { stop };
}

function resourceList() {
  return KNOWN_RESOURCES.map((uri) => ({
    uri,
    name: uri.replace('bridge://', ''),
    mimeType: 'application/json',
  }));
}

function notifyResourceUpdates(server: Server, type: BridgeEvent['type']) {
  const uris: string[] = ['bridge://events/recent', 'bridge://stats'];
  if (type === 'error') uris.push('bridge://events/errors');
  if (type === 'network') uris.push('bridge://events/network');
  if (type === 'navigation' || type === 'pageview') uris.push('bridge://events/navigation');
  if (type === 'screenshot') uris.push('bridge://events/screenshot');

  uris.forEach((uri) => server.notification({ method: 'notifications/resources/updated', params: { uri } }));
}
