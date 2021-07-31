const { MessageEmbed } = require('discord.js');
const {
  Command,
  CommandoMessage,
} = require('discord.js-commando');
const lolQuery = require('lol-query');

module.exports = class lolCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'lol',
      group: 'message',
      memberName: 'lol',
      description: 'Permet de voir ses stats sur LoL',
      args: [
        {
          key: 'query',
          prompt:
            'Et ton pseudo je dois le trouver tout seul chien ?',
          type: 'string',
        },
      ],
    });
  }

  /**
   * @param {CommandoMessage} message
   * @param {String} query
   */
  async run(message, { query }) {
    if (/\s/.test(query)) {
      return message.say(
        new MessageEmbed()
          .setTitle('Erreur :no_entry:')
          .setDescription(
            'Retapes le pseudo du joueur sans espace.'
          )
          .setColor('RED')
      );
    }
    
    let playerStats;
    const playerName = query;

    lolQuery
      .getStats(playerName, 'euw', false)
      .then((stats) => (playerStats = stats));

    setTimeout(function () {
      try {
        let embed = new MessageEmbed()
          .setTitle(playerStats.Name)
          .setAuthor(
            'League of Legends',
            'https://www.eclypsia.com/content/LoL/Ruined_King/RK_Logo.png'
          )
          .addFields(
            {
              name: 'Level',
              value: playerStats.Level,
              inline: true,
            },
            {
              name: 'Rank',
              value:
                playerStats.Rank + ' | ' + playerStats.RankedLP,
              inline: true,
            },
            {
              name: 'Winrate (20 dernières games)',
              value: `${playerStats.WinRate} (${playerStats.RecentWins}V/${playerStats.RecentLoses}L)`,
              inline: false,
            }
          )
          .addFields(
            {
              name: 'Main role',
              value: playerStats.MainLane,
              inline: true,
            },
            {
              name: 'Main champion',
              value: playerStats.MainChampion,
              inline: true,
            }
          )
          .setColor('BLUE')
          .setURL(
            'https://euw.op.gg/summoner/userName=' +
              playerStats.Name
          )
          .setFooter(
            'Dernière game ' + playerStats.LastTimeOnline
          );

        return message.say(embed);
      } catch(error) {
        return message.say(
          new MessageEmbed()
            .setTitle('Erreur :no_entry:')
            .addField(
              'Une erreur est survenue',
              '- Soit le joueur ' +
                playerName +
                " est introuvable \n - Soit le joueur n'a pas été actif au cours des derniers mois \n - Soit une erreur avec le serveur est survenue"
            )
            .setFooter('Je n\'ai jamais tord, alors essayes de nouveau')
            .setColor('RED')
        );
      }
    }, 20000);

    return message.say(
      new MessageEmbed()
        .setTitle('Recherche :hourglass_flowing_sand:')
        .setDescription('Recherche du joueur en cours...')
        .setColor('GREEN')
    );
  }
};
