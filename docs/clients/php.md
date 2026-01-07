# PHP Quickstart

Status: **Experimental** (no heartbeat or reconnect yet; keep sessions short)

## Install

- Published (after release): `composer require shaneholloman/aria-bridge-php`
- From repo for dev/testing:

  ```bash
  cd php
  composer install
  ```

## Run the example

```bash
bunx aria-bridge-host
export ARIA_BRIDGE_URL=$(node -p "require('./.aria/aria-bridge.json').url")
export ARIA_BRIDGE_SECRET=$(node -p "require('./.aria/aria-bridge.json').secret")
php php/examples/basic.php
```

## Embed in your app

```php
use AriaBridge\BridgeConfig;
use AriaBridge\Client;

$client = new Client(new BridgeConfig(
    getenv('ARIA_BRIDGE_URL'),
    getenv('ARIA_BRIDGE_SECRET'),
    'php-app',
    ['console', 'error']
));

$client->start();
$client->sendConsole('hello from php');
$client->sendError('sample error');
$client->stop();
```

## API surface

- `start()` → opens WS, sends `auth` + `hello` (protocol 2)
- `sendConsole(message, level='info')`
- `sendError(message)`
- `stop()` → closes WS
- Heartbeat/reconnect: **not implemented yet**

## Notes & limits

- No buffering; send assumes an open connection
- Console + error events only
- Use env `ARIA_BRIDGE_URL` / `ARIA_BRIDGE_SECRET` (defaults: `ws://localhost:9877`, `dev-secret`)
