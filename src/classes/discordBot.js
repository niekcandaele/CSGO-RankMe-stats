const config = require('../../config.json');
const Commando = require('discord.js-commando');
const path = require('path');
const sqlite = require('sqlite');

/**
 * Class to handle the discord bot
 */
class DiscordBot {

    constructor() {
        this.client = new Commando.Client({
            commandPrefix: config.discordBot.prefix,
            owner: config.discordBot.owner
        });

        // Guild settings persistance
        this.client.setProvider(
            sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new Commando.SQLiteProvider(db))
        ).catch(e => console.log(e));

        this.client.dataFields = global.dataFields;

        // Connect the player model to the discord this.client
        this.client.Player = global.models.Player;
        this.client.config = config;
        this.client.sequelize = global.sequelize;

        this._initListeners();
        this._initCommands();
        this.client.login(process.env.DISCORD_TOKEN);
    }

    /**
     * Initialize event listeners
     */
    _initListeners() {
        this.client.on('ready', () => {
            console.log(`Connected to Discord as ${this.client.user.tag}!`);
        });

        this.client.on('commandRun', (command, promise, message) => {
            console.log(`Command ${command.name} run by ${message.author.tag}`)
        });

        this.client.on('error', e => {
            console.log(e)
        });
    }

    /**
     * Load registered commands from file
     */
    _initCommands() {
        this.client.registry
            .registerGroups([
                ['stats', 'Statistics about CSGO'],
            ])
            .registerDefaults()
            .registerCommandsIn(path.join(__dirname, '../commands'));
    }
}

module.exports = DiscordBot