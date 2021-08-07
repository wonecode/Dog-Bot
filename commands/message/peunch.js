const { MessageEmbed } = require('discord.js');
const { Command, CommandoMessage } = require('discord.js-commando');

module.exports = class toxicoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'peunch',
      group: 'message',
      memberName: 'peunch',
      description: "Afin d'identifier l'individu Peunch",
    });
  }

  /**
   * @param {CommandoMessage} message
   */
  async run(message) {
    return message.say(
      new MessageEmbed()
        .setTitle('ID: Sir Peunch')
        .setDescription(
          'Sir Peunch est un **imbécile heureux**, est le roi de **Peunchville** et se distingue de sa communauté par sa couleur de **N World**.'
        )
        .setImage('https://i.imgur.com/SCk9bkq.png')
        .setFooter("Individu étrange mais inoffensif")
    );
  }
};
