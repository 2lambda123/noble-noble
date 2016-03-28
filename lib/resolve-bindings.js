var os = require('os');

var platform = os.platform();

function resolveBindings(){
  if (process.env.NOBLE_WEBSOCKET) {
    return require('./websocket/bindings');
  } else if (process.env.NOBLE_DISTRIBUTED) {
    return require('./distributed/bindings');
  } else if (platform === 'darwin') {
    return require('./mac/bindings');
  } else if (platform === 'linux' || platform === 'win32') {
    return require('./hci-socket/bindings');
  } else {
    throw new Error('Unsupported platform');
  }
}

module.exports = resolveBindings;