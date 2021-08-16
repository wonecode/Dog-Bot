const { MessageEmbed } = require('discord.js');
const { Command, CommandoMessage } = require('discord.js-commando');
const fs = require('fs');
const cheerio = require('cheerio');
const got = require('got');

module.exports = class valorantCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'valorant',
      aliases: ['val'],
      group: 'valorant',
      memberName: 'valorant',
      description: "Permet de voir les stats d'un joueur sur Valorant",
      args: [
        {
          key: 'query',
          prompt: 'Et ton pseudo je dois le trouver tout seul chien ?',
          type: 'string',
        },
      ],
    });
  }

  /**
   * @param {CommandoMessage} message
   * @param {string} query
   */
  async run(message, { query }) {
    const oldQuery = query.split('#');
    let username = oldQuery[0];
    username = username.replace(' ', '');
    const tagline = oldQuery[1];

    const vgmUrl =
      'https://tracker.gg/valorant/profile/riot/' +
      username +
      '%23' +
      tagline +
      '/overview?playlist=competitive';

    got(vgmUrl)
      .then((response) => {
        const $ = cheerio.load(response.body);
        const playerName = $('.trn-ign__username').text();
        const playerTagline = $('.trn-ign__discriminator').text();
        const playerIcon = $('image').attr('href');
        const playerRank = $('.valorant-rank-icon').attr('alt');

        let playerWinloss = $('text', '.valorant-winloss').text();
        playerWinloss = playerWinloss.trim();
        playerWinloss = playerWinloss.split('\n');

        const playerWinsOld = playerWinloss[0];
        const playerWins = parseInt(playerWinsOld);
        const playerLossOld = playerWinloss[2].trim();
        const playerLoss = parseInt(playerLossOld);
        const playerWinrate = Math.round((playerWins / (playerWins + playerLoss)) * 100) + '%';

        let giantStats = $('.giant-stats').text();
        giantStats = giantStats.split('      ');

        let headshotPrct = giantStats[2];
        headshotPrct = headshotPrct.split('  ');
        const playerHS = headshotPrct[1];

        let kdRatio = giantStats[1];
        kdRatio = kdRatio.split('  ');
        const playerKD = kdRatio[1];

        let agents = $('.agent').text();
        agents = agents.split('  ');
        const playerMainAgent = agents[1].trim();

        const playerMainWeapon = $('.weapon__name').html();

        return message.say(
          new MessageEmbed()
            .setAuthor(playerName + ' ' + playerTagline, playerIcon, vgmUrl)
            .setColor('RED')
            .addField('Rang', playerRank, true)
            .addField('Winrate', `${playerWinrate} (${playerWins}V/${playerLoss}D)`, true)
            .addField('Headshot %', playerHS, true)
            .addField('K/D Ratio', playerKD, true)
            .addField('Main agent', playerMainAgent, true)
            .addField('Team', playerMainWeapon, true)
            .setFooter($('h2').text())
        );
      })
      .catch((err) => {
        console.log(err);

        return message.say(
          new MessageEmbed()
            .setAuthor(
              'Valorant',
              'https://studio.cults3d.com/4QqRV9kLYYEuw9ur_X3yjQl1sjk=/516x516/https://files.cults3d.com/uploaders/15024335/illustration-file/a86d53e4-2bd9-4a8f-9550-986686c3131a/gi0mAjIh_400x400.png',
              'https://playvalorant.com/fr-fr/'
            )
            .setTitle('Joueur introuvable')
            .setDescription(
              "Le joueur que tu as recherché est introuvable ou n'a pas connecté son compte avec tracker.gg (https://tracker.gg/valorant/)"
            )
            .setTimestamp()
        );
      });

    return message.say(
      new MessageEmbed()
        .setTitle('Recherche :hourglass_flowing_sand:')
        .setDescription('Recherche du joueur en cours...')
        .setColor('GREEN')
    );
  }
};
