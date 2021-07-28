const {
  Command,
  CommandoMessage,
} = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class wowCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'wow',
      group: 'message',
      memberName: 'world of warcraft',
      description:
        'Compte à rebours avant que World of Warcraft soit finito pepito',
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
      .setTitle('World of Warcraft')
      .setURL(
        'https://www.newworld.com/fr-fr/game-editions'
      )
      .setColor('GREEN')
      .addField(
        'Temps restant avant la fin de World of Warcraft',
        days +
          ' jours, ' +
          hours +
          ' heures, ' +
          minutes +
          ' minutes.'
      )
      .setImage(
        'https://www.gamereactor.fr/media/06/_2940673b.jpg'
      )
      .setFooter('');

    return message.say(embed);
  }
};
