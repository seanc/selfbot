const Client = require('discord.js').Client;
const bot = new Client();
const zt = require('zt');
const notify = require('./notify');
const config = require('rc')('selfbot', {
  token: '',
  prefix: 'self.'
});
const glob = require('require-glob');

bot.on('ready', () => zt.log('Started'));

glob(['scripts/**/*.js']).then(modules => {
  const scripts = Object.keys(modules).map(key => modules[key]);
  const commands = new Map();

  scripts.forEach(script => {
    const run = script(bot, config, notify);
    if (run && script.command) {
      commands.set(script.command, run);
    }
  });

  bot.on('message', message => {
    if (message.content.startsWith(config.prefix) && message.author.discriminator === bot.user.discriminator) {
      const args = message.content.slice(config.prefix.length).split(' ');
      const command = args.shift();

      if (commands.has(command)) {
        commands.get(command)(message, args);
      }
    }
  })
}).catch(err => console.log(err));

bot.login(config.token);
