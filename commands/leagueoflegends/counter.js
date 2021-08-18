const { MessageEmbed } = require('discord.js');
const { Command, CommandoMessage } = require('discord.js-commando');
const cheerio = require('cheerio');
const request = require('request');
const got = require('got');

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

module.exports = class valorantCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'counter',
      aliases: ['c'],
      group: 'leagueoflegends',
      memberName: 'counterlol',
      description:
        "Permet de voir les meilleurs et les pires counters d'un champion sur League of Legends",
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
    const cleanQuery = query.replace(' ', '');

    const vgmUrl = 'https://u.gg/lol/champions/' + cleanQuery + '/counter';

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
          const championName = $('.champion-name', '.champion-header').text();
          const championIcon = $('.champion-image', '.champion-header').attr('src');
          const championTitle = $('.champion-title', '.champion-header').text();
          const patchNotes = $('.header-patch').text();

          // CounterChampions
          let championCountersWinrate = [];

          $('.win-rate', '.best-win-rate').each(function (i) {
            championCountersWinrate.push($(this).text());
          });

          let championCountersGames = [];

          $('.total-games', '.best-win-rate').each(function (i) {
            championCountersGames.push($(this).text());
          });

          let championCounters = [];

          $('.champion-name', '.best-win-rate').each(function (i) {
            championCounters.push(
              '**' + $(this).text() + '**' + ' • ' + championCountersWinrate[i]
            );
          });

          // WorstChampions
          let championWorstWinrate = [];

          $('.win-rate', '.worst-win-rate').each(function (i) {
            championWorstWinrate.push($(this).text());
          });

          let championWorstGames = [];

          $('.total-games', '.worst-win-rate').each(function (i) {
            championWorstGames.push($(this).text());
          });

          let championWorst = [];

          $('.champion-name', '.worst-win-rate').each(function (i) {
            championWorst.push('**' + $(this).text() + '**' + ' • ' + championWorstWinrate[i]);
          });

          championWorst.unshift('--------------------------------');
          championCounters.unshift('--------------------------------');

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
          } else if (championName === "Kha'Zix") {
            championTitleClean = 'Khazix';
          }

          const championSplash =
            'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/' +
            championTitleClean +
            '_' +
            getRandomInt(3) +
            '.jpg';

            if ($('h1').text() === "THIS PAGEDOESN'T EXIST") {
              return message.say(
                new MessageEmbed()
                  .setAuthor(
                    'League of Legends',
                    'https://www.eclypsia.com/content/LoL/Ruined_King/RK_Logo.png'
                  )
                  .setTitle('Champion introuvable')
                  .setDescription("Le champion que tu as recherché n'existe pas")
                  .setTimestamp()
              );
            } else {
              return message.say(
                new MessageEmbed()
                  .setAuthor(championName, championIcon, vgmUrl)
                  .setDescription(championTitle)
                  .setColor('BLUE')
                  .addField(
                    `:white_check_mark: Best Picks vs ${championName}`,
                    championCounters,
                    true
                  )
                  .addField(`:no_entry: Worst Picks vs ${championName}`, championWorst, true)
                  .setImage(championSplash)
                  .setTimestamp()
                  .setFooter(
                    patchNotes,
                    'https://www.eclypsia.com/content/LoL/Ruined_King/RK_Logo.png'
                  )
              );
            }
        }
      }
    );

    return message.say(
      new MessageEmbed()
        .setAuthor(
          'League of Legends',
          'https://www.eclypsia.com/content/LoL/Ruined_King/RK_Logo.png'
        )
        .setTitle('Recherche :hourglass_flowing_sand:')
        .setDescription('Recherche des counters en cours...')
        .setColor('GREEN')
    );
  }
};
