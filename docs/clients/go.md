# Go Quickstart

Status: **Preview** (heartbeat 15s/30s, reconnect with 1s→30s backoff, no buffering)

## Install

- Published: `go install github.com/shaneholloman/aria-bridge/go/ariabridge@latest`
- From repo: `cd go && go test ./...` (uses module path `github.com/shaneholloman/aria-bridge/go/ariabridge`)

## Run the example

```bash
bunx aria-bridge-host
export ARIA_BRIDGE_URL=$(node -p "require('./.aria/aria-bridge.json').url")
export ARIA_BRIDGE_SECRET=$(node -p "require('./.aria/aria-bridge.json').secret")
go run go/examples/main.go
```

## Embed in your app

```go
import (
  "context"
  ariabridge "github.com/shaneholloman/aria-bridge/go/ariabridge"
)

cfg := ariabridge.ClientConfig{URL: url, Secret: secret, Capabilities: []string{"console", "error"}}
client := ariabridge.NewClient(cfg)
ctx, cancel := context.WithCancel(context.Background())
defer cancel()

_ = client.Start(ctx)             // opens WS, sends auth + hello, starts ping/pong
_ = client.SendConsole("info", "hello from go")
// client.Close() when shutting down
```

## API surface

- `Start(ctx)` — connects, sends `auth` + `hello`, starts heartbeat & reconnect loop
- `Close()` — closes WS
- `SendConsole(level, message)` — console event
- Heartbeat: 15s ping / 30s timeout
- Reconnect: exponential backoff 1s → 30s
- Buffering: not implemented (send calls expect an open connection)

## Notes & limits

- Console + error events only; no screenshots/control/network capture yet
- Set `ARIA_BRIDGE_URL` / `ARIA_BRIDGE_SECRET`; defaults to `ws://localhost:9877` and `dev-secret` if env missing
