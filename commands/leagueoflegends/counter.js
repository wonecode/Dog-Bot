const { MessageEmbed } = require('discord.js');
const { Command, CommandoMessage } = require('discord.js-commando');
const cheerio = require('cheerio');
const request = require('request');
const got = require('got');

module.exports = class valorantCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'counter',
      aliases: ['c'],
      group: 'leagueoflegends',
      memberName: 'leagueoflegends',
      description: "Permet de voir les counters d'un champion sur League of Legends",
      args: [
        {
          key: 'query',
          prompt: 'Et le champion je dois le trouver tout seul chien ?',
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
    const cleanQuery = query.replace(' ', '-');

    const vgmUrl = 'https://lolcounter.com/champions/' + cleanQuery + '/weak';

    const req = request.defaults({
      jar: true, // save cookies to jar
      rejectUnauthorized: true,
      followAllRedirects: true, // allow redirections
    });

    // scrape the page
    req.get(
      {
        url: vgmUrl,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',
        },
      },
      function (err, resp, body) {
        if (resp.statusCode === 200) {
          // load the html into cheerio
          const $ = cheerio.load(body);
          const championName = $('.name', '.champion-stats').text();
          let championLanes = $('.lanes', '.champion-stats').text();

          let championCountersLanes = [];

          $('.lane', '.weak-strong').each(function () {
            championCountersLanes.push('[' + $(this).text() + ']');
          });

          let championCounters = [];

          $('.name', '.weak-strong').each(function (i) {
            championCounters.push('• ' + '**' + $(this).text() + '** ' + championCountersLanes[i]);
          });

          championLanes = championLanes.split('\n');
          const championMainLane = championLanes[1].replace('\t', '').trim();
          const championSecondLane = championLanes[2].replace('\t', '').trim();

          let championTitleClean = championName.replace(' ', '');

          if (championName === 'Dr. Mundo') {
            championTitleClean = 'DrMundo';
          } else if (championName === "Cho'Gath") {
            championTitleClean = 'Chogath';
          } else if (championName === "Kog'Maw") {
            championTitleClean = 'KogMaw';
          } else if (championName === "Kai'Sa") {
            championTitleClean = 'Kaisa';
          } else if (championName === "Vel'Koz") {
            championTitleClean = 'Velkoz';
          }

          const championSplash =
            'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/' +
            championTitleClean +
            '_1.jpg';

          const championIcon =
            'https://ddragon.leagueoflegends.com/cdn/11.16.1/img/champion/' +
            championTitleClean +
            '.png';

          return message.say(
            new MessageEmbed()
              .setAuthor(championName, championIcon, vgmUrl)
              .setDescription(
                `${championMainLane}${championSecondLane === '' ? '' : ','} ${championSecondLane}`
              )
              .addField('Liste des counters', championCounters)
              .setColor('BLUE')
              .setImage(championSplash)
          );
        }
      }
    );
  }
};
