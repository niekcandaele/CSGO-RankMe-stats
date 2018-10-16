require('dotenv').config();
const config = require('../config.json');

/*
______  ___ _____ ___ ______  ___  _____ _____ 
|  _  \/ _ \_   _/ _ \| ___ \/ _ \/  ___|  ___|
| | | / /_\ \| |/ /_\ \ |_/ / /_\ \ `--.| |__  
| | | |  _  || ||  _  | ___ \  _  |`--. \  __| 
| |/ /| | | || || | | | |_/ / | | /\__/ / |___ 
|___/ \_| |_/\_/\_| |_|____/\_| |_|____/\____/ 
*/


const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.MYSQL_DB, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});

// Test to make sure we can connect to the database. If not, it will exit the process.
sequelize
    .authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
    });

// Initiate the player model
const Player = require("./models/player")(sequelize, Sequelize);

// Bind models to object
const Models = {
    Player: Player
}

/*
______ _____ _____ _____ _________________ 
|  _  \_   _/  ___/  __ \  _  | ___ \  _  \
| | | | | | \ `--.| /  \/ | | | |_/ / | | |
| | | | | |  `--. \ |   | | | |    /| | | |
| |/ / _| |_/\__/ / \__/\ \_/ / |\ \| |/ / 
|___/  \___/\____/ \____/\___/\_| \_|___/  
*/

if (config.discordBot.enabled) {
    const Commando = require('discord.js-commando');
    const path = require('path');
    const sqlite = require('sqlite');

    const client = new Commando.Client({
        commandPrefix: config.discordBot.prefix,
        owner: config.discordBot.owner
    });

    client.on('ready', () => {
        console.log(`Connected to Discord as ${client.user.tag}!`);
    });

    client.on('commandRun', (command, promise, message) => {
        console.log(`Command ${command.name} run by ${message.author.tag}`)
    });

    client.on('error', e => {
        console.log(e)
    });

    // Guild settings persistance
    client.setProvider(
        sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new Commando.SQLiteProvider(db))
    ).catch(e => console.log(e));

    client.registry
        .registerGroups([
            ['stats', 'Statistics about CSGO'],
        ])
        .registerDefaults()
        .registerCommandsIn(path.join(__dirname, 'commands'));

    client.login(process.env.DISCORD_TOKEN);

    // Connect the player model to the discord client
    client.Player = Player;
    client.sequelize = sequelize;
    client.config = config;
}
