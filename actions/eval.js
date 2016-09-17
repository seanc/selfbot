const parse = require('markdown').markdown.parse;
const notify = require('../notify');
const vm = require('vm');
const util = require('util');

function eval(bot, opts) {
  return function run(message, args) {
    if (args.length < 1) {
      return notify('Invalid args');
    }

    try {
      const block = args.join(' ').trim().replace(/\n/g, '');
      const code = parse(block)[1][1][1].replace(/^js(.*)/g, '');

      const script = new vm.Script(unescape(code), {
        timeout: 10000
      });
      const inject = {
        global: global,
        message: message,
        args: args,
        bot: bot,
        options: opts,
        require: require,
        debug: function(_message) {
          message.channel.sendCode('js', util.inspect(_message));
        }
      };
      const context = vm.createContext(inject);
      const result = script.runInContext(context, {
        timeout: 5000
      });

      inject.debug(result);
      message.delete();
    } catch (e) {
      notify(e.message);
    }
  };
}

module.exports = eval;
