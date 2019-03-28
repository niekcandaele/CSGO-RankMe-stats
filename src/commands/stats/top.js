const Commando = require('discord.js-commando');
const RichEmbed = require('discord.js').RichEmbed;

class Top extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'top',
            aliases: ['low'],
            group: 'stats',
            memberName: 'top',
            description: `Shows top players for a server. 
                Use alias "low" to reverse the sorting and get lowest results first. 
                Use argument "list" to see a list of possible types.`,
            args: [{
                key: 'type',
                default: 'score',
                type: 'string',
                prompt: "Please specify a valid type.",
                oneOf: client.dataFields.concat(['list'])
            }, {
                key: 'amount',
                default: 10,
                type: 'integer',
                prompt: "Please specify how many players to list.",
                max: 50,
                min: 1
            }],
        });
    }

    async run(msg, args) {

        if (args.type === "list") {
            return msg.channel.send(`**There are ${this.client.dataFields.length} possible types!**\n\n${this.client.dataFields.join(', ')}`)
        }

        let orderType = "DESC"
        if (msg.content.includes('low')) {
            orderType = "ASC"
        }

        let totalPlayers = await this.client.Player.count();

        let topPlayers = await this.client.Player.findAll({
            limit: args.amount,
            order: [
                [args.type, orderType]
            ]
        });
        let resultEmbed = new RichEmbed({
            title: `Top ${args.amount > topPlayers.length ? topPlayers.length : args.amount} players by ${orderType === "DESC" ? "highest" : "lowest"} ${args.type}`
        });

        resultEmbed.setFooter(`Tracking ${totalPlayers} players!`)
        .setTimestamp()

        let counter = 1;
        let playerList = new String();
        for (const player of topPlayers) {

            let prefixText = counter;

            if (counter == 1) {
                prefixText = ":first_place: "
            }

            if (counter == 2) {
                prefixText = ":second_place: "
            }

            if (counter == 3) {
                prefixText = ":third_place: "
            }

            playerList += `${prefixText}. ${player.dataValues.name} - ${player.dataValues[args.type]}\n`;
            counter++
        }

        resultEmbed.setDescription(playerList);

        await msg.channel.send(resultEmbed);

    }

}


module.exports = Top;