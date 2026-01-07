# Client Quickstarts

Thin SDKs in multiple languages share the same protocol and API shape (see `../client-api-spec.md`). Each quickstart follows the same steps:

1) Install the SDK
2) Configure `url` + `secret` (env recommended)
3) Initialize/start the client
4) Send a first event (console/log or pageview)
5) Verify the host received it
6) Next steps for framework integration

Common setup (applies to every SDK):

```
bunx aria-bridge-host  # writes .aria/aria-bridge.json with url/secret
export ARIA_BRIDGE_URL=$(node -p "require('./.aria/aria-bridge.json').url")
export ARIA_BRIDGE_SECRET=$(node -p "require('./.aria/aria-bridge.json').secret")
```

Quickstarts:

- [Python](python.md) (preview)
- [Go](go.md) (preview)
- [PHP](php.md) (experimental)
- [Ruby](ruby.md) (experimental)
- [Rust](rust.md) (experimental)
- [Swift](swift.md) (experimental)
- [Java](java.md) (scaffold / WIP)
- Roblox / Lua HTTP: see [roblox.md](roblox.md)

Root-level one-liners (from repo root):

```
bun run sdk:php
bun run sdk:ruby
bun run sdk:rust
bun run sdk:swift
bun run sdk:java
bun run sdk:python
bun run sdk:go
```

Release prep: see `docs/release-checklist.md` for per-registry steps and version bump guidance.

Status/maturity: see `docs/clients/status.md` for feature coverage and recommended usage.
