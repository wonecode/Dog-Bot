const { MessageEmbed } = require('discord.js');
const { Command, CommandoMessage } = require('discord.js-commando');
const fs = require('fs');
const cheerio = require('cheerio');
const got = require('got');

module.exports = class mmaCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ufc',
      group: 'ufc',
      memberName: 'ufc',
      description: "Permet de voir les stats d'un joueur de l'UFC",
      args: [
        {
          key: 'query',
          prompt: 'Et son nom je dois le trouver tout seul chien ?',
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
    const oldQuery = query.split(' ');
    const firstName = oldQuery[0];
    const lastName = oldQuery[1];

    const vgmUrl = 'https://www.ufc.com/athlete/' + firstName + '-' + lastName;

    got(vgmUrl)
      .then((response) => {
        const $ = cheerio.load(response.body);
        const fighterName = $('h1').html();
        const fighterSurname = $('.field-name-nickname').text();
        const fighterImage = $('.c-hero__image').attr('src');

        let fighterGlobalStats = $('.c-hero__headline-suffix').html();
        fighterGlobalStats = fighterGlobalStats.trim();
        fighterGlobalStats = fighterGlobalStats.split('\n');

        let fighterWinRatio;
        let fighterCat;
        let fighterCategory;
        let fighterRank;
        let fighterStatus;

        if (fighterGlobalStats.length === 4) {
          fighterWinRatio = fighterGlobalStats[3];
          fighterCat = fighterGlobalStats[1].split(' ');
          fighterCategory = fighterCat[12];
          fighterRank = fighterGlobalStats[0];
          fighterStatus = 'Actif';
        } else if (fighterGlobalStats.length === 3) {
          fighterWinRatio = fighterGlobalStats[2];
          fighterCat = fighterGlobalStats[0].split(' ');
          fighterCategory = fighterCat[0];
          fighterStatus = 'Actif';

          if (fighterCategory === 'Ancien') {
            fighterCategory = 'Non définie';
            fighterStatus = 'Retraité';
          }
        }

        console.log(fighterGlobalStats);

        return message.say(
          new MessageEmbed()
            .setAuthor(
              'Ultimate Fighting Championship',
              'https://fightnight101.com/wp-content/uploads/2021/04/UFC-264-Full-Fight-Card.png',
              'https://www.ufc.com/'
            )
            .setTitle(fighterName)
            .setURL(vgmUrl)
            .setDescription(fighterSurname)
            .addField('Win ratio', fighterWinRatio ? fighterWinRatio : 'Non défini', true)
            .addField('Catégorie', fighterCategory ? fighterCategory : 'Non définie', true)
            .addField('Classement', fighterRank ? fighterRank : 'Non défini', true)
            .addField('Statut', fighterStatus, true)
            .setImage(fighterImage)
            .setColor('#d20a0a')
        );
      })
      .catch((err) => {
        console.log(err);

        return message.say(
          new MessageEmbed()
          .setAuthor(
            'Ultimate Fighting Championship',
            'https://fightnight101.com/wp-content/uploads/2021/04/UFC-264-Full-Fight-Card.png',
            'https://www.ufc.com/'
          )
          .setTitle('Combattant introuvable')
          .setDescription('Le combattant que tu as recherché est introuvable.')
          .setTimestamp()
        );
      });
  }
};
