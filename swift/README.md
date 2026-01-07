# Swift Aria Bridge Client

## One-liner

From repo root: `bun run sdk:swift` (runs `swift test` with the parity suite).

## Features

- Auth → waits for `auth_success`, then sends `hello` (protocol v2)
- Heartbeat ping/pong (15s/30s defaults) with timeout-driven reconnect
- Reconnect with exponential backoff + jitter (1s→30s)
- Buffered sends (default 200, drop-oldest) with a single drop-count notice
- Control requests via `onControl` handler

## API

- `AriaBridgeClient(config:)`
- `start()` / `stop()`
- `sendConsole(_:, level:)`, `sendError(_:)`
- `onControl { msg in ... }`

## Tests

```sh
bun run sdk:swift           # CI-equivalent parity suite
# or
cd swift && swift test --filter AriaBridgeClientParityTests
```

Tests use the Node ProtocolHost in `Tests/ProtocolHost.js` to assert handshake ordering, buffering/drop notice, control round-trip, and heartbeat reconnect.
