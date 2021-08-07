const { MessageEmbed } = require('discord.js');
const { Command, CommandoMessage } = require('discord.js-commando');

module.exports = class toxicoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'parow',
      group: 'message',
      memberName: 'parow',
      description: "Afin d'identifier l'individu Parrow",
    });
  }

  /**
   * @param {CommandoMessage} message
   */
  async run(message) {
    return message.say(
      new MessageEmbed()
        .setTitle('ID: Parow')
        .setDescription(
          'Parow est un individu errant dans la nature et porte les caractèristiques de **pédophile alcoolique**.'
        )
        .setImage('https://images.news18.com/ibnlive/uploads/2020/02/Proboscis-Monkey.jpg')
        .setFooter("Individu dangereux, à s'en méfier")
    );
  }
};
