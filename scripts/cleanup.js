function cleanup(bot, opts, notify) {
  return function run(message, args) {
    if (args.length < 1) {
      return notify('Invalid arguments');
    }

    message.channel.fetchMessages()
    .then(messages => {
      let count = 0;
      const list = messages.findAll('author', bot.user);

      args[0]++;

      list.forEach(message => {
        if (++count <= args[0]) {
          message.delete();
        }
      });

      notify(`Deleted ${--args[0]} messages`)
    })
    .catch(err => console.log(err));
  };
}

cleanup.command = 'cleanup';

module.exports = cleanup;
