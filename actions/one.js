const request = require('request');
const url = 'https://raw.githubusercontent.com/seanc/one/master/shorts.json';

function one(bot, options) {
  request(url, (err, res, body) => {
    const shorts = JSON.parse(body);
    bot.on('message', message => {
      if (message.author.discriminator !== bot.user.discriminator) return;

      const match = message.content.match(/[\.]([^\s]+)/gi);
      if (!match) return;

      match.forEach(s => {
        s = s.split('.')[1];
        if (shorts.hasOwnProperty(s)) {
          const _short = shorts[s][0];
          message.content = message.content.replace(`.${s}`, _short);
        }
      });

      message.edit(message.content);
    });
  });
}

module.exports = one;
