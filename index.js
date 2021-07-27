const { CommandoClient } = require('discord.js-commando');
const path = require('path');
require('dotenv').config();

const client = new CommandoClient({
    commandPrefix: '!',
    owner: '225587353815744513',
    invite: 'https://discord.gg/5VQzz8D8Rj'
});

client.registry
  .registerDefaultTypes()
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerGroup('music', 'Music')
  .registerGroup('message', 'Message')
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.server = {
    queue: [],
    currentVideo: { title: "", url: "" },
    dispatcher: null
};

client.once('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag} -  (${client.user.id})`);
});

client.on('error', (error) => console.error(error));

client.login(process.env.DISCORD_TOKEN);