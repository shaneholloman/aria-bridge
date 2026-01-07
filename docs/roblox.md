# Roblox / Lua bridge (HTTP)

Use the HTTP bridge when your platform cannot open WebSockets (Roblox Studio). This client is dev-only and Studio-first.

## Files

- `lua/AriaBridge.lua` — Roblox HttpService client (Studio-only by default). Requires HttpService enabled.

## Host setup

1) In your workspace root: `bunx aria-bridge-host` (writes `.aria/aria-bridge.json`, typically `ws://127.0.0.1:9876`). Copy the `secret` from that file, or start the host with an explicit value using `ARIA_BRIDGE_SECRET=your-secret bunx aria-bridge-host` to keep it stable across restarts.
2) Ensure the host stays running while you play-test.

## Game setup (Rojo-friendly)

1) Copy `lua/AriaBridge.lua` into your game, e.g. `ReplicatedStorage/AriaBridge/AriaBridge.lua`.
2) Enable HttpService in Studio (Game Settings → Security → Allow HTTP Requests).
3) Start the client in Studio-only code:

```lua
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local RunService = game:GetService("RunService")
local ok, AriaBridge = pcall(require, ReplicatedStorage:WaitForChild("AriaBridge"):WaitForChild("AriaBridge"))
if ok and RunService:IsStudio() then
    local bridge = AriaBridge.new({
        baseUrl = "http://127.0.0.1:9876",
        -- Use the secret from .aria/aria-bridge.json or the value you set in ARIA_BRIDGE_SECRET
        secret = "<copy-from-aria-bridge.json>",
        projectId = "my-roblox-game",
        route = "server",
        capabilities = {"console", "error"},
    })
    bridge:start()
    bridge:event("server_boot", { placeId = game.PlaceId })
end
```

## Safety & scope

- Defaults to Studio-only; set `forceEnable=true` to override.
- All HttpService calls are pcalled and batched (flush every ~1s, up to 50 events).
- Captures `LogService` and `ScriptContext.Error`; no screenshots (Roblox limitation).

## Keeping forks in sync

- Treat `lua/AriaBridge.lua` as the canonical copy. Downstream games should vendor it verbatim; refresh by copying the file when updating the host.
