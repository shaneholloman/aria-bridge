const { startBridge } = require('./dist/index.js');

console.log('Starting bridge client...');

const bridge = startBridge({
  url: 'ws://127.0.0.1:9878',
  secret: '5cd06587803219367599fabdbb6c44f6894c19c3a62ba60b4d71c189537a95c7',
  projectId: 'test-demo',
  enabled: true,
  enableNetwork: true,
  enableControl: true,
});

console.log('Bridge connected.');
console.log('Sending test events...\n');

console.log('LOG: This is a test log');
console.warn('WARN: This is a test warning');
console.error('ERROR: This is a test error');

setTimeout(() => {
  console.log('\nEvents sent. Disconnecting...');
  bridge.disconnect();
  process.exit(0);
}, 2000);
