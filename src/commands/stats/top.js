const Commando = require('discord.js-commando');
const RichEmbed = require('discord.js').RichEmbed;

let possibleTypes = ['score', 'kills', 'deaths', 'assists', 'suicides', 'tk', 'shots', 'hits', 'headshots', 'rounds_tr', 'rounds_ct', 'knife', 'glock', 'hkp2000', `usp_silencer`, `p250`, `deagle`, `elite`, `fiveseven`, `tec9`, `cz75a`, `revolver`, `nova`, `xm1014`, `mag7`, `sawedoff`, `bizon`, `mac10`, `mp9`, `mp7`, `ump45`, `p90`, `galilar`, `ak47`, `scar20`, `famas`, `m4a1`, `m4a1_silencer`, `aug`, `ssg08`, `sg556`, `awp`, `g3sg1`, `m249`, `negev`, `hegrenade`, `flashbang`, `smokegrenade`, `inferno`, `decoy`, `taser`, `mp5sd`, `head`, `chest`, `stomach`, `left_arm`, `right_arm`, `left_leg`, `right_leg`, `c4_planted`, `c4_exploded`, `c4_defused`, `ct_win`, `tr_win`, `hostages_rescued`, `vip_killed`, `vip_escaped`, `vip_played`, `mvp`, `damage`, `match_win`, `match_draw`, `match_lose`]

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
                oneOf: possibleTypes.concat(['list'])
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
            return msg.channel.send(`**There are ${possibleTypes.length} possible types!**\n\n${possibleTypes.join(', ')}`)
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