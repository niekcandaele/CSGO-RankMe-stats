const Commando = require('discord.js-commando');
const RichEmbed = require('discord.js').RichEmbed;
const Sequelize = require('sequelize');

class Stats extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'stats',
            group: 'stats',
            memberName: 'stats',
            description: 'Shows server wide statistics'
        });
    }

    async run(msg, args) {

        let resultEmbed = new RichEmbed({
            title: `:globe_with_meridians: Global statistics`
        });

        let totalPlayers = await this.client.Player.count();
        resultEmbed.setFooter(`Tracking ${totalPlayers} players!`)
            .setColor('RANDOM')
            .setTimestamp()

        let topScorePlayer = await this.client.Player.findAll({
            limit: 3,
            order: [
                ['score', 'DESC']
            ],
            where: {
                kills: {
                    [Sequelize.Op.gt]: this.client.config.discordBot.minimumKillsBeforeStatsCalc
                }
            }
        });

        let topKDAPlayer = await this.client.Player.findAll({
            attributes: {
                include: [
                    [this.client.sequelize.literal("`kills` / (`deaths` + 1)"), "kda"]
                ]
            },
            limit: 3,
            order: [
                [this.client.sequelize.literal("`kills` / (`deaths` + 1)"), 'DESC']
            ],
            where: {
                kills: {
                    [Sequelize.Op.gt]: this.client.config.discordBot.minimumKillsBeforeStatsCalc
                }
            }
        });

        let topTKPlayer = await this.client.Player.findAll({
            limit: 3,
            order: [
                ['tk', 'DESC']
            ],
            where: {
                kills: {
                    [Sequelize.Op.gt]: this.client.config.discordBot.minimumKillsBeforeStatsCalc
                }
            }
        });

        let mostAccuratePlayer = await this.client.Player.findAll({
            attributes: {
                include: [
                    [this.client.sequelize.condition(this.client.sequelize.col('hits'), '/', this.client.sequelize.col('shots')), "accuracy"]
                ]
            },
            limit: 3,
            order: [
                [this.client.sequelize.condition(this.client.sequelize.col('hits'), '/', this.client.sequelize.col('shots')), 'DESC']
            ],
            where: {
                kills: {
                    [Sequelize.Op.gt]: this.client.config.discordBot.minimumKillsBeforeStatsCalc
                }
            }
        });

        let mostHeadshotPercentagePlayer = await this.client.Player.findAll({
            attributes: {
                include: [
                    [this.client.sequelize.condition(this.client.sequelize.col('headshots'), '/', this.client.sequelize.col('kills')), "headshotPercent"]
                ]
            },
            limit: 3,
            order: [
                [this.client.sequelize.condition(this.client.sequelize.col('headshots'), '/', this.client.sequelize.col('kills')), 'DESC']
            ],
            where: {
                kills: {
                    [Sequelize.Op.gt]: this.client.config.discordBot.minimumKillsBeforeStatsCalc
                }
            }
        });

        let leastHitsPerKill = await this.client.Player.findAll({
            attributes: {
                include: [
                    [this.client.sequelize.condition(this.client.sequelize.col('hits'), '/', this.client.sequelize.col('kills')), "efficiency"]
                ]
            },
            limit: 3,
            order: [
                [this.client.sequelize.condition(this.client.sequelize.col('hits'), '/', this.client.sequelize.col('kills'))]
            ],
            where: {
                kills: {
                    [Sequelize.Op.gt]: this.client.config.discordBot.minimumKillsBeforeStatsCalc
                }
            }
        });

        let bestWinRate = await this.client.Player.findAll({
            limit: 3,
            attributes: {
                include: [
                    [this.client.sequelize.literal("`match_win`/ (`match_win` + `match_draw` + `match_lose`)"), "winLossRatio"]
                ]
            },
            order: [
                [this.client.sequelize.literal("`match_win`/ (`match_win` + `match_draw` + `match_lose`)"), 'DESC']
            ],
            where: {
                kills: {
                    [Sequelize.Op.gt]: this.client.config.discordBot.minimumKillsBeforeStatsCalc
                }
            }
        });

        let topKnifeKills = await this.client.Player.findAll({
            limit: 3,
            order: [
                ['knife', 'DESC']
            ],
            where: {
                kills: {
                    [Sequelize.Op.gt]: this.client.config.discordBot.minimumKillsBeforeStatsCalc
                }
            }
        });

        let topTaserKills = await this.client.Player.findAll({
            limit: 3,
            order: [
                ['taser', 'DESC']
            ],
            where: {
                kills: {
                    [Sequelize.Op.gt]: this.client.config.discordBot.minimumKillsBeforeStatsCalc
                }
            }
        });

        let topMvp = await this.client.Player.findAll({
            limit: 3,
            order: [
                ['mvp', 'DESC']
            ],
            where: {
                kills: {
                    [Sequelize.Op.gt]: this.client.config.discordBot.minimumKillsBeforeStatsCalc
                }
            }
        });


        if (topScorePlayer.length === 0) {
            return msg.channel.send(`No players were found! Please check that your database has info in it.`)
        }

        resultEmbed.addField(`:star: Top score`, generateTopThreeString(topScorePlayer, "score", this.client.config), true);
        resultEmbed.addField(`:star2: Top Kill/death ratio`, generateTopThreeString(topKDAPlayer, "kda", this.client.config), true);
        resultEmbed.addField(`:poop:  Most teamkills`, generateTopThreeString(topTKPlayer, "tk", this.client.config), true);
        resultEmbed.addField(`:gun:  Most accurate`, generateTopThreeString(mostAccuratePlayer, "accuracy", this.client.config), true);
        resultEmbed.addField(`:cowboy: Headshot %`, generateTopThreeString(mostHeadshotPercentagePlayer, "headshotPercent", this.client.config), true);
        resultEmbed.addField(`:dart: Most efficient`, generateTopThreeString(leastHitsPerKill, "efficiency", this.client.config), true);
        resultEmbed.addField(`:trophy: Best win/loss ratio`, generateTopThreeString(bestWinRate, "winLossRatio", this.client.config), true);
        resultEmbed.addField(`:dagger: Most knife kills`, generateTopThreeString(topKnifeKills, "knife", this.client.config), true);
        resultEmbed.addField(`:zap: Most zeus kills`, generateTopThreeString(topTaserKills, "taser", this.client.config), true);
        resultEmbed.addField(`:crown: Most MVPs`, generateTopThreeString(topMvp, "mvp", this.client.config), true);

        await msg.channel.send(resultEmbed);

    }

}


module.exports = Stats;

function generateTopThreeString(players, field, config) {
    let returnString = new String();
    let counter = 1;

    if (players.length === 0) {
        return "No players found."
    }

    for (const player of players) {

        let prefixText = counter;

        if (config.discordBot.stats_showMedals) {
            if (counter == 1) {
                prefixText = ":first_place: "
            }

            if (counter == 2) {
                prefixText = ":second_place: "
            }

            if (counter == 3) {
                prefixText = ":third_place: "
            }
        }

        switch (field) {
            case "accuracy":
                let accuracyPercent = (player.dataValues.accuracy * 100).toFixed(2);
                player.dataValues[field] = accuracyPercent + "%";
                break;
            case "headshotPercent":
                let headshotPercent = (player.dataValues.headshotPercent * 100).toFixed(2);
                player.dataValues[field] = headshotPercent + "%";
                break;
            case "efficiency":
                let efficiecyPercent = parseFloat(player.dataValues[field]).toFixed(2);
                player.dataValues[field] = efficiecyPercent + " hits per kill";
                break;
            case "winLossRatio":
                let winLossRatio = (player.dataValues.winLossRatio * 100).toFixed(2)
                player.dataValues[field] = winLossRatio + "%  " + `${player.dataValues.match_win}W ${player.dataValues.match_lose}L`;
                break;
            default:
                break;
        }

        returnString += `${prefixText}. ${player.dataValues.name}\n${player.dataValues[field]}\n`;
        counter++
    }
    return returnString
}