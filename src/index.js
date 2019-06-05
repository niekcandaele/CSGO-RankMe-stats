require('dotenv').config();
const cluster = require('cluster');
const config = require('../config.json');
const winston = require('winston');
const path = require('path');
const fs = require('fs');
const figlet = require('figlet')
const _ = require('lodash');

const HistoricalDataClass = require('./classes/historicalData');

global.config = config;
// Relevant data fields, used to enumerate
global.dataFields = ['score', 'kills', 'deaths', 'assists', 'suicides', 'tk', 'shots', 'hits', 'headshots', 'rounds_tr', 'rounds_ct', 'knife', 'glock', 'hkp2000', `usp_silencer`, `p250`, `deagle`, `elite`, `fiveseven`, `tec9`, `cz75a`, `revolver`, `nova`, `xm1014`, `mag7`, `sawedoff`, `bizon`, `mac10`, `mp9`, `mp7`, `ump45`, `p90`, `galilar`, `ak47`, `scar20`, `famas`, `m4a1`, `m4a1_silencer`, `aug`, `ssg08`, `sg556`, `awp`, `g3sg1`, `m249`, `negev`, `hegrenade`, `flashbang`, `smokegrenade`, `inferno`, `decoy`, `taser`, `mp5sd`, `head`, `chest`, `stomach`, `left_arm`, `right_arm`, `left_leg`, `right_leg`, `c4_planted`, `c4_exploded`, `c4_defused`, `ct_win`, `tr_win`, `hostages_rescued`, `vip_killed`, `vip_escaped`, `vip_played`, `mvp`, `damage`, `match_win`, `match_draw`, `match_lose`]

/*
  _      ____   _____  _____ _____ _   _  _____ 
 | |    / __ \ / ____|/ ____|_   _| \ | |/ ____|
 | |   | |  | | |  __| |  __  | | |  \| | |  __ 
 | |   | |  | | | |_ | | |_ | | | | . ` | | |_ |
 | |___| |__| | |__| | |__| |_| |_| |\  | |__| |
 |______\____/ \_____|\_____|_____|_| \_|\_____|
                                                
*/

// ensure log directory exists
var logDirectory = path.resolve(process.cwd(), "logs");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

var options = {
    infofile: {
        level: config.logLevel,
        filename: path.resolve(logDirectory, "info.log"),
        handleExceptions: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.simple()
        ),
    },
    errorfile: {
        level: "error",
        filename: path.resolve(logDirectory, "error.log"),
        handleExceptions: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.simple()
        ),
    }
};

const logger = winston.createLogger({
    transports: [
        new winston.transports.File(options.infofile),
        new winston.transports.File(options.errorfile)
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        level: config.logLevel,
        timestamp: true,
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        ),
    }));
}

global.logger = logger;

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
    logging: (msg) => {
        if (config.logSQL) {
            logger.debug(msg)
        }
    },
});

// Test to make sure we can connect to the database. If not, it will exit the process.
sequelize
    .authenticate()
    .then(() => {
        if (cluster.isMaster) {
            logger.info('Database connection has been established successfully.');
        }
    }).catch(e => {
        logger.error('Fatal error while connecting to database ' + e);
        process.exit(1);
    });


// Initiate the player model
const Player = require("./models/player")(sequelize, Sequelize);
// Initialize the historicalData model
const HistoricalData = require('./models/historicalData')(sequelize, Sequelize);

Player.sync();

// Bind models to object
const Models = {
    Player,
    HistoricalData
}

global.models = Models;
global.sequelize = sequelize;


if (cluster.isMaster) {

    // Count the machine's CPUs
    const cpuCount = require('os').cpus().length;
    logger.info(`Detected ${cpuCount} available CPUs, scaling webserver to ${cpuCount} processes`)

    // Create a worker for each CPU
    if (process.env.NODE_ENV !== 'test') {
        for (var i = 0; i < cpuCount; i += 1) {
            cluster.fork();
        }
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
        if (_.isEmpty(process.env.DISCORD_TOKEN)) {
            logger.error("You must provide a bot token when you enable the Discord bot module. Disabling for now...");
        } else {
            const DiscordBot = require('./classes/discordBot');
            global.discordBot = new DiscordBot();
        }

    }

    /*
      _    _ _     _             _           _   _____        _
     | |  | (_)   | |           (_)         | | |  __ \      | |
     | |__| |_ ___| |_ ___  _ __ _  ___ __ _| | | |  | | __ _| |_ __ _
     |  __  | / __| __/ _ \| '__| |/ __/ _` | | | |  | |/ _` | __/ _` |
     | |  | | \__ \ || (_) | |  | | (_| (_| | | | |__| | (_| | || (_| |
     |_|  |_|_|___/\__\___/|_|  |_|\___\__,_|_| |_____/ \__,_|\__\__,_|
    */

    if (config.historicalData.enabled) {
        // Start the historicalData class
        HistoricalData.sync().then(() => {
            const historicalDataHook = new HistoricalDataClass();
        })
    }

    // Code to run if we're in a worker process
} else {
    logger.debug(`Started a child process with ID ${cluster.worker.id}`)

    /*
    __          __  _                                  
    \ \        / / | |                                 
     \ \  /\  / /__| |__  ___  ___ _ ____   _____ _ __ 
      \ \/  \/ / _ \ '_ \/ __|/ _ \ '__\ \ / / _ \ '__|
       \  /\  /  __/ |_) \__ \  __/ |   \ V /  __/ |   
        \/  \/ \___|_.__/|___/\___|_|    \_/ \___|_|   
    */

    if (config.webserver.enabled) {
        const Web = require('./classes/web');
        const webserver = new Web();

        global.app = webserver.app;
    }

}

if (cluster.isMaster) {
    figlet('RankMe stats', function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.log(err);
            return;
        }
        console.log(data)
    });
}


process.on('unhandledRejection', (reason, p) => {
    //global.logger.info('Unhandled Rejection at: Promise', p, 'reason:', reason);
    global.logger.info(`Unhandled rejection - ${reason}`);
    process.exit(1);
});