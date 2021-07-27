const {
  Command,
  CommandoMessage,
} = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class toxicoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'toxico',
      group: 'message',
      memberName: 'toxico',
      description: 'Afin de fermer le clapet de Peunch',
    });
  }

  /**
   * @param {CommandoMessage} message
   */
  async run(message) {
    return message.say('Ferme ta gueule Peunch');
  }
};
