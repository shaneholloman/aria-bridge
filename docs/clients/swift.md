# Swift Quickstart

Status: **Experimental** (ping heartbeat only; no reconnect/backoff yet)

## Install

- SPM: add package `https://github.com/shaneholloman/aria-bridge.git`
- From repo: `cd swift && swift build`

## Run the example (macOS CLI)

```bash
bunx aria-bridge-host
export ARIA_BRIDGE_URL=$(node -p "require('./.aria/aria-bridge.json').url")
export ARIA_BRIDGE_SECRET=$(node -p "require('./.aria/aria-bridge.json').secret")
swift run --package-path swift AriaBridgeExample
```

## Embed in your app

```swift
import AriaBridgeClient

let url = URL(string: ProcessInfo.processInfo.environment["ARIA_BRIDGE_URL"] ?? "ws://localhost:9877")!
let secret = ProcessInfo.processInfo.environment["ARIA_BRIDGE_SECRET"] ?? "dev-secret"
let client = AriaBridgeClient(config: BridgeConfig(url: url, secret: secret, projectId: "ios-app"))

Task {
  try await client.start()
  try await client.sendConsole("hello from swift")
  try await client.sendError("sample error")
}
```

## API surface

- `start()` / `stop()` (async)
- `sendConsole(_ message, level: String = "info")`
- `sendError(_ message)`
- Heartbeat: 15s ping loop
- Reconnect/backoff: **not implemented yet**
- Buffering: none

## Notes & limits

- Console + error events only
- Designed for dev tooling; secure secrets appropriately for device builds
