const { Command, CommandoMessage } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class nbaCommand extends Command {
  constructor(client) {
    super(client, {
      name: '2k',
      group: 'gamecountdown',
      memberName: 'nba 2k22',
      description: 'Compte à rebours pour la sortie de 2K22',
    });
  }

  /**
   * @param {CommandoMessage} message
   */
  async run(message) {
    const release = 'September 10 2021';

    const total = Date.parse(release) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    var embed = new MessageEmbed()
      .setTitle('NBA 2K22')
      .setURL('https://nba.2k.com/fr-FR/buy/')
      .setColor('RED')
      .setAuthor(
        '2K',
        'https://pbs.twimg.com/profile_images/855132067419398148/38ZTnv1o_400x400.jpg'
      )
      .addField(
        'Temps restant avant la sortie de NBA 2K22',
        days + ' jours, ' + hours + ' heures, ' + minutes + ' minutes.'
      )
      .setImage(
        'https://i0.wp.com/noopinhogames.com/wp-content/uploads/2021/07/NBA2K22.jpg?resize=1140%2C641&ssl=1'
      )
      .setTimestamp();

    if (total <= 0) {
      return message.say(
        new MessageEmbed()
          .setTitle('NBA 2K22')
          .setAuthor(
            '2K',
            'https://pbs.twimg.com/profile_images/855132067419398148/38ZTnv1o_400x400.jpg'
          )
          .setURL('https://nba.2k.com/fr-FR/buy/')
          .setColor('RED')
          .setDescription('NBA 2K22 est sorti ! :tada:')
          .setImage(
            'https://i0.wp.com/noopinhogames.com/wp-content/uploads/2021/07/NBA2K22.jpg?resize=1140%2C641&ssl=1'
          )
          .setTimestamp()
      );
    }

    return message.say(embed);
  }
};
