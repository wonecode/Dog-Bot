const {
  Command,
  CommandoMessage,
} = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class nbaCommand extends Command {
  constructor(client) {
    super(client, {
      name: '2k',
      group: 'message',
      memberName: 'nba 2k22',
      description:
        'Compte à rebours pour la sortie de 2K22',
    });
  }

  /**
   * @param {CommandoMessage} message
   */
  async run(message) {
    const release = 'September 10 2021';

    const total =
      Date.parse(release) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor(
      (total / (1000 * 60 * 60)) % 24
    );
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    var embed = new MessageEmbed()
      .setTitle('NBA 2K22')
      .setURL('https://nba.2k.com/fr-FR/buy/')
      .setColor('RED')
      .addField(
        'Temps restant',
        'Il reste ' +
          days +
          ' jours, ' +
          hours +
          ' heures, ' +
          minutes +
          ' minutes et ' +
          seconds +
          ' secondes.'
      )
      .setImage(
        'https://i0.wp.com/noopinhogames.com/wp-content/uploads/2021/07/NBA2K22.jpg?resize=1140%2C641&ssl=1'
      )
      .setFooter('');

    return message.say(embed);
  }
};
