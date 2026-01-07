#!/usr/bin/env ruby
require_relative '../lib/aria_bridge_client'

url = ENV.fetch('ARIA_BRIDGE_URL', 'ws://localhost:9877')
secret = ENV.fetch('ARIA_BRIDGE_SECRET', 'dev-secret')

client = AriaBridge::Client.new(url: url, secret: secret, project_id: 'ruby-example')
client.start
client.send_console('hello from ruby')
client.send_error('sample error')
sleep 0.5
client.stop
