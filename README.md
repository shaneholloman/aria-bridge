# @shaneholloman/aria-bridge

Development-only bridge that captures errors, logs, and optional controls from your app and streams them to a workspace host. Works across web, Node.js, React Native, Roblox/Lua (HTTP), and thin backend SDKs.

## Links

- Usage & configuration: [docs/usage.md](docs/usage.md)
- Language quickstarts: [docs/clients/README.md](docs/clients/README.md)
- SDK status matrix: [docs/clients/status.md](docs/clients/status.md)
- Roblox / Lua guide: [docs/clients/roblox.md](docs/clients/roblox.md)

## Install (JS/TS)

```bash
bun add @shaneholloman/aria-bridge
```

## Quickstart (JS/TS)

1. Start the host (writes `.aria/aria-bridge.json` with `url` + `secret`):

    ```bash
    bunx aria-bridge-host
    ```

2. Bootstrap the bridge early in your app:

    ```ts
    import { startBridge } from '@shaneholloman/aria-bridge';

    startBridge({
      url: process.env.ARIA_BRIDGE_URL,      // or read from .aria/aria-bridge.json
      secret: process.env.ARIA_BRIDGE_SECRET,
      projectId: 'my-app',
      enableControl: false,                  // opt-in features; see docs/usage.md
    });
    ```

3. In React Native, the same call works; in Node.js you can also enable network/control capture.

## Other runtimes (preview / experimental)

Export `ARIA_BRIDGE_URL` and `ARIA_BRIDGE_SECRET` (read them from `.aria/aria-bridge.json`), then run:

| Language        | Dev one-liner                                               | Docs                            |
| --------------- | ----------------------------------------------------------- | ------------------------------- |
| Roblox / Lua    | `bun run copy:lua-client` (then require `AriaBridge.lua`)   | [guide](docs/clients/roblox.md) |
| Python          | `python python/examples/basic_usage.py`                     | [guide](docs/clients/python.md) |
| Go              | `go run go/examples/main.go`                                | [guide](docs/clients/go.md)     |
| PHP             | `php php/examples/basic.php`                                | [guide](docs/clients/php.md)    |
| Ruby            | `bundle exec ruby ruby/examples/basic.rb`                   | [guide](docs/clients/ruby.md)   |
| Rust            | `cargo run --example basic --manifest-path rust/Cargo.toml` | [guide](docs/clients/rust.md)   |
| Swift           | `swift run --package-path swift AriaBridgeExample`          | [guide](docs/clients/swift.md)  |
| Java (scaffold) | `bun run sdk:java`                                          | [guide](docs/clients/java.md)   |

## Host in one paragraph

`aria-bridge-host` is a singleton WebSocket server per workspace. It locks at `.aria/aria-bridge.lock`, writes `.aria/aria-bridge.json` with `url`, `port`, and `secret`, and fans out events from bridges to consumers (e.g., Aria, MCP). Start it with `bunx aria-bridge-host [workspace-path]`.

## Demos & tests (JS/TS)

- Node demo: `bun test` (runs `demo/node-demo.js`, assumes host running)
- Web demo: `bun run build` then open `demo/web-demo.html`
- Workspace bridge demo: `node demo/workspace-bridge-demo.js /path/to/workspace`
