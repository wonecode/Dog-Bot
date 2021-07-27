const { VoiceConnection } = require('discord.js');
const { Command, CommandoMessage } = require("discord.js-commando");
const ytdl = require('ytdl-core-discord');

module.exports = class ResumeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'resume',
            group: 'music',
            memberName: 'resume',
            description: 'Resume la musique en cours d\'écoute',
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
            server.dispatcher.resume();
        }

        return message.say(':play_pause: **Resume** :thumbsup:')
    }
}