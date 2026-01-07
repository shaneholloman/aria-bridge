<?php

require __DIR__ . '/../vendor/autoload.php';

use AriaBridge\BridgeConfig;
use AriaBridge\Client;

$url = getenv('ARIA_BRIDGE_URL') ?: 'ws://localhost:9877';
$secret = getenv('ARIA_BRIDGE_SECRET') ?: 'dev-secret';

$client = new Client(new BridgeConfig($url, $secret, 'php-example'));
$client->start();
$client->sendConsole('hello from php');
$client->sendError('sample error');
$client->stop();
