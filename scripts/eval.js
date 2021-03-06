const parse = require('markdown').markdown.parse;
const vm = require('vm');
const util = require('util');

function eval(bot, opts, notify) {
  return function run(message, args) {
    if (args.length < 1) {
      return notify('Invalid args');
    }

    try {
      const block = args.join(' ').trim();
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
          message.channel.sendCode('js', util.inspect(_message), {split: true});
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

eval.command = 'eval';

module.exports = eval;
