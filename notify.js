const notifier = require('node-notifier');

module.exports = function(message) {
  notifier.notify({
    title: 'Selfbot',
    message: message
  });
};
