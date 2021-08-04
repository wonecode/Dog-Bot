const {
  Command,
  CommandoMessage,
} = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class newworldCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'newworld',
      group: 'gamecountdown',
      memberName: 'new world',
      description: 'Compte à rebours pour la sortie de New World',
    });
  }

  /**
   * @param {CommandoMessage} message
   */
  async run(message) {
    const release = 'August 31 2021';

    const total =
      Date.parse(release) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor(
      (total / (1000 * 60 * 60)) % 24
    );
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    var embed = new MessageEmbed()
      .setTitle('New World')
      .setURL(
        'https://www.newworld.com/fr-fr/game-editions'
      )
      .setColor('GREY')
      .addField(
        'Temps restant avant la sortie de New World',
          days +
          ' jours, ' +
          hours +
          ' heures, ' +
          minutes +
          ' minutes.'
      )
      .setImage(
        'https://site-cdn.givemesport.com/images/21/06/21/89f4382344138a85226d31a78064ef5d/1201.jpg'
      )
      .setFooter('');

    return message.say(embed);
  }
};
