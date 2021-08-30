const { MessageEmbed } = require('discord.js');
const { Command, CommandoMessage } = require('discord.js-commando');
require('dotenv').config();
const token = process.env.RIOT_TOKEN;
const fetch = require('node-fetch');
const { romanToArab, arabToRoman, isValidArab, isValidRoman } = require('roman-numbers');

module.exports = class leagueCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'league',
      aliases: ['lol'],
      group: 'leagueoflegends',
      memberName: 'leaguestatsv2',
      description: 'Permet de voir ses stats sur LoL (v2)',
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
   * @param {String} query
   */
  async run(message, { query }) {
    function firstCaps(word) {
      word = word.toLowerCase();
      word = word[0].toUpperCase() + word.substring(1);

      return word;
    }

    // Fetch data from data dragon

    const version = '11.15.1';

    const dragonResponse = await fetch(
      'http://ddragon.leagueoflegends.com/cdn/' + version + '/data/fr_FR/champion.json'
    );
    const dragonData = await dragonResponse.json();
    let championList = dragonData.data;

    function getChampName(id) {
      for (var i in championList) {
        if (championList[i].key == id) {
          return championList[i].id;
        }
      }
    }

    function getChampQuote(id) {
      for (var i in championList) {
        if (championList[i].key == id) {
          return championList[i].title;
        }
      }
    }

    // Fetch summoner data and verify if exist

    const summonerResponse = await fetch(
      encodeURI(
        'https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' +
          query +
          '?api_key=' +
          token
      )
    );
    const summonerData = await summonerResponse.json();

    if (summonerData.id) {
      const summonerId = summonerData.id;

      // Get league profile stats

      const leagueResponse = await fetch(
        'https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/' +
          summonerId +
          '?api_key=' +
          token
      );

      const leagueData = await leagueResponse.json();

      let playerStats;
      for (let i = 0; i < leagueData.length; i++) {
        if (leagueData[i].queueType === 'RANKED_SOLO_5x5') {
          playerStats = leagueData[i];
        }
      }

      // Get season history

      const accountId = summonerData.accountId;

      const matchesReponse = await fetch(
        'https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/' +
          accountId +
          '?queue=420' +
          '&api_key=' +
          token
      );

      const matchesData = await matchesReponse.json();
      const matchesList = matchesData.matches;

      // Filter if actual season is null

      if (leagueData.length !== 0) {
        const playerWinrate =
          Math.round((playerStats.wins / (playerStats.wins + playerStats.losses)) * 100) + '%';

        // Convert timestamp to time

        const lastGameDate = matchesList[0].timestamp;
        const actualDate = Date.parse(new Date());
        const lastGame = actualDate - lastGameDate;

        function msToTime(s) {
          let ms = s % 1000;
          s = (s - ms) / 1000;
          let secs = s % 60;
          s = (s - secs) / 60;
          let mins = s % 60;
          let hrs = (s - mins) / 60;
          let days = Math.round(hrs / 24);

          if (days >= 1) {
            return 'Dernière partie classée il y a ' + days + ' jours';
          } else if (hrs > 0) {
            return 'Dernière partie classée il y a ' + hrs + ' heures';
          } else if (hrs <= 0) {
            return 'Dernière partie classée il y a ' + mins + ' minutes';
          }
        }

        // Main role

        let lane = [];
        for (let i = 0; i < matchesList.length; i++) {
          if (matchesList[i].lane === 'BOTTOM') {
            lane.push(matchesList[i].role);
          } else {
            lane.push(matchesList[i].lane);
          }
        }

        const arrToInstanceCountObj = (arr) =>
          arr.reduce((obj, e) => {
            obj[e] = (obj[e] || 0) + 1;
            return obj;
          }, {});

        const laneOcc = arrToInstanceCountObj(lane);

        function getSortedKeys(obj) {
          var keys = (keys = Object.keys(obj));
          return keys.sort(function (a, b) {
            return obj[b] - obj[a];
          });
        }

        let playerMostRole = getSortedKeys(laneOcc)[0];

        if (playerMostRole === 'NONE') {
          playerMostRole = getSortedKeys(laneOcc)[1];
        }

        if (playerMostRole === 'DUO_CARRY') {
          playerMostRole = 'AD Carry';
        } else if (playerMostRole === 'DUO_SUPPORT') {
          playerMostRole = 'Support';
        } else {
          playerMostRole = firstCaps(playerMostRole);
        }

        // Main champion

        let champions = [];
        for (let i = 0; i < matchesList.length; i++) {
          champions.push(matchesList[i].champion);
        }

        const championsOcc = arrToInstanceCountObj(champions);
        let playerMainChamp = getSortedKeys(championsOcc)[0];

        // Return message if true

        return message.say(
          new MessageEmbed()
            //.setTitle('OPGG')
            //.setURL(encodeURI('https://euw.op.gg/summoner/userName=' + summonerData.name))
            .setAuthor(
              summonerData.name,
              'http://ddragon.leagueoflegends.com/cdn/11.15.1/img/profileicon/' +
                summonerData.profileIconId +
                '.png',
              encodeURI('https://euw.op.gg/summoner/userName=' + summonerData.name)
            )
            .setDescription(getChampQuote(playerMainChamp))
            .setColor('BLUE')
            .addField('Niveau', summonerData.summonerLevel, true)
            .addField('Win streak', playerStats.hotStreak == true ? ':fire:' : ':snowflake:', true)
            .addField(
              'Rang',
              firstCaps(playerStats.tier) +
                ' ' +
                romanToArab(playerStats.rank) +
                ' | ' +
                playerStats.leaguePoints +
                ' LP',
              true
            )
            .addField(
              'Winrate',
              playerWinrate + ' (' + playerStats.wins + 'V/' + playerStats.losses + 'D' + ')',
              true
            )
            .addField('Main rôle', playerMostRole, true)
            .addField('Main champion', getChampName(playerMainChamp), true)
            .setFooter(msToTime(lastGame))
        );

        // Return errors if false
      } else {
        return message.say(
          new MessageEmbed()
            .setTitle('Joueur inactif :warning:')
            .setDescription(
              'Le joueur **' +
                summonerData.name +
                "** n'a pas joué en partie classée durant la saison 11"
            )
            .setFooter("Je n'ai jamais tord, alors essayes de nouveau")
            .setColor('ORANGE')
        );
      }
    } else {
      if (summonerData.status.status_code === 404) {
        return message.say(
          new MessageEmbed()
            .setTitle('Joueur introuvable :warning:')
            .setDescription('Le joueur **' + query + '** est introuvable')
            .setFooter("Je n'ai jamais tord, alors essayes de nouveau")
            .setColor('ORANGE')
        );
      } else if (summonerData.status.status_code === 403) {
        return message.say(
          new MessageEmbed()
            .setTitle('Une erreur est survenue :no_entry:')
            .setDescription(
              "Désolé, la requête n'a pas pu être effectuée à cause d'un problème lié au serveur. Contactez **Wone#2395** si le problème persiste."
            )
            .setTimestamp()
            .setColor('RED')
        );
      }
    }
  }
};
