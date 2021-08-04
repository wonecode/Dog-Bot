const { Command, CommandoMessage } = require('discord.js-commando');

module.exports = class toxicoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'gagaweed',
      group: 'message',
      memberName: 'gagaweed',
      description: "Découvrez l'hymne national gaga",
    });
  }

  /**
   * @param {CommandoMessage} message
   */
  async run(message) {
    return message.say('https://www.youtube.com/watch?v=VEmwyztE8S0');
  }
};
