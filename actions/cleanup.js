const notify = require('../notify');

function cleanup(bot, options) {
  return function run(message, args) {
    if (args.length < 1) {
      return notify('Invalid amount of arguments');
    }

    const channel = message.channel;

    channel.fetchMessages({limit: ++args[0]})
    .then(messages => {
      const deleted = messages.filter(_message => {
        return _message.author.discriminator === bot.user.discriminator;
      }).deleteAll();

      notify(`Deleted ${--deleted.length} messages`);
    })
    .catch(err => notify(err));
  };
}

module.exports = cleanup;
