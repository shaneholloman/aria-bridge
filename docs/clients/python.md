# Python Quickstart

Status: **Preview** (heartbeat 15s/timeout 30s, reconnect with 1s→30s backoff, buffered sends)

## Install

- Published (when released): `pip install aria-bridge-client`
- Local dev from this repo:

  ```bash
  cd python
  pip install -r requirements.txt
  pip install .
  ```

## Run the example

```bash
# 1) Start the host once (writes .aria/aria-bridge.json)
bunx aria-bridge-host

# 2) Export connection details for any SDK
export ARIA_BRIDGE_URL=$(node -p "require('./.aria/aria-bridge.json').url")
export ARIA_BRIDGE_SECRET=$(node -p "require('./.aria/aria-bridge.json').secret")

# 3) Send a console + error event
python python/examples/basic_usage.py
```

## Embed in your app

```python
import asyncio, json
from aria_bridge.client import AriaBridgeClient, BridgeConfig

meta = json.load(open('.aria/aria-bridge.json'))
cfg = BridgeConfig(url=meta['url'], secret=meta['secret'], project_id='api-service')
client = AriaBridgeClient(cfg)

async def run():
  await client.start()
  await client.send_console('hello from python', level='info')
  await client.send_error('sample error')
  await asyncio.sleep(0.2)
  await client.stop()

asyncio.run(run())
```

## API surface

- `await client.start()` / `await client.stop()` — opens the WebSocket and starts ping/pong heartbeats
- `send_console(message, level='info')`
- `send_error(message, stack=None)`
- Heartbeat: 15s ping / 30s timeout
- Reconnect: exponential backoff 1s → 30s
- Buffer: 200 events, drop-oldest when full

## Notes & limits

- Currently console + error only (no screenshots/control/network capture yet)
- Not published to PyPI yet; use local install until release
- Uses `ARIA_BRIDGE_URL` / `ARIA_BRIDGE_SECRET`; defaults to `ws://localhost:9877` and `dev-secret` if unset
