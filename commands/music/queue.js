const { MessageEmbed } = require("discord.js");
const { Command, CommandoMessage } = require("discord.js-commando");

module.exports = class QueueCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'queue',
            group: 'music',
            memberName: 'queue',
            description: "Affiche la file d'attente. Pour afficher différentes pages, tape mla commande avec le numéro de page spécifié après (queue 2)",
            args: [
                {
                    key: 'page',
                    prompt: 'Quelle page afficher blaireau ?',
                    default: 1,
                    type: 'integer'
                }
            ]
        });
    }

    /**
     * 
     * @param {CommandoMessage} message
     * @param {Number} page
     */
    async run(message, { page }) {
        const server = message.client.server;

        if (!message.client.voice.connections.first()) {
            return message.say(':x: **Je suis pas dans un channel vocal blaireau**');
        }

        const itemsNumber = 10;
        const startingItem = (page - 1) * itemsNumber;
        const queueLength = server.queue.length;

        var iteamPerPage = startingItem + itemsNumber;
        var totalPages = 1;

        var embed = new MessageEmbed()
            .setTitle(`File d'attente pour ${message.author.username}`)
            .setColor('YELLOW')
            .addField('En train de jouer :', server.currentVideo.url);

        if (queueLength > 0) {
            var value = "";

            if (queueLength > itemsNumber) {
                totalPages = Math.ceil(queueLength / itemsNumber);
            }

            if (page <= 0 || (page) > totalPages) {
                return message.say(':x: Cette page n\'existe pas bouffon');
            }

            if ( (queueLength - startingItem) < itemsNumber) {
                iteamPerPage = (queueLength - startingItem) + startingItem;
            }

            for (let i = startingItem; i < iteamPerPage; i++) {
                const video = server.queue[i];
                value += "`" + (i + 1) + ".` " + video.url + '\n';
            }

            embed.addField('A venir: ', value);
        }

        embed.setFooter(`Page ${page}/${totalPages}`);

        return message.say(embed);
    }
}