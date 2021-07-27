const { Command, CommandoMessage } = require("discord.js-commando");

module.exports = class LeaveCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'leave',
            group: 'music',
            memberName: 'leave',
            description: 'Fait quitter le bot de votre channel vocal',
        });
    }

    /**
     * 
     * @param {CommandoMessage} message 
     * @param {String} query 
     */
    async run(message) {
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) {
            return message.say(':x: **Tu dois être dans un channel vocal pour utiliser cette commande**')
        }

        await voiceChannel.leave();

        return message.say(":thumbsup: **J'ai quitté** " + "`" + voiceChannel.name + "`" + " **car y'a que des blaireaux là bas**");
    }
}