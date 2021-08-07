const { CommandoClient } = require('discord.js-commando');
const path = require('path');
require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 5000;
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');

const client = new CommandoClient({
  commandPrefix: '!',
  owner: '225587353815744513',
  invite: 'https://discord.gg/5VQzz8D8Rj',
});

client.registry
  .registerDefaultTypes()
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerGroup('music', 'Music')
  .registerGroup('message', 'Message')
  .registerGroup('leagueoflegends', 'League of Legends')
  .registerGroup('gamecountdown', 'Games countdown')
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.server = {
  queue: [],
  currentVideo: { title: '', url: '' },
  dispatcher: null,
};

client.once('ready', () => {
  const date = new Date();
  const cleanDate = date.toLocaleString('fr-FR');

  console.log(`Connecté en tant que ${client.user.tag} -  (${client.user.id})`);
  client.channels.cache
    .get('870785785274695771')
    .send(
      new MessageEmbed()
        .setTitle(client.user.tag)
        .setColor('ORANGE')
        .addField('Statut', 'Maintenance')
        .setFooter(cleanDate)
    );
  client.user.setPresence({
    activity: {
      name: `${client.guilds.cache.size} serveurs`,
      type: 'WATCHING',
    },
    status: 'online',
  });
});

client.on('error', (error) => {
  console.error(error);
});

mongoose
  .connect(process.env.MONGODB_SRV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Connecté à MongoDB');
  })
  .catch((error) => {
    console.log(error);
  });

client.login(process.env.DISCORD_TOKEN);

express().listen(PORT, () => console.log(`Listening on ${PORT}`));
