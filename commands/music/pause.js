const { Command, CommandoMessage } = require("discord.js-commando");
const ytdl = require('ytdl-core-discord');

module.exports = class PauseCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'pause',
            group: 'music',
            memberName: 'pause',
            description: 'Met en pause la musique en cours d\'écoute',
        });
    }

    /**
     * 
     * @param {CommandoMessage} message 
     * @param {String} query 
     */
    async run(message) {
        const server = message.client.server;

        if (!message.member.voice.channel) {
            return message.say(':x: **Tu dois être dans un channel vocal pour utiliser cette commande**')
        }

        if (!message.client.voice.connections.first()) {
            return message.say(':x: **Je suis pas dans un channel vocal**')
        }

        if (server.dispatcher) {
            server.dispatcher.pause();
        }

        return message.say(':pause_button: **Pause** :thumbsup:')
    }
}