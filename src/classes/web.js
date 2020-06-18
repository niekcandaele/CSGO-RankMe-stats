const config = require('../../config.json');
const express = require('express');
const path = require('path');
const _ = require('lodash');
const Op = require('sequelize').Op
const morgan = require('morgan');
const cluster = require('cluster');

const port = config.webserver.port;

/**
 * Express Request Object
 * 
 * @external Request
 * @see {@link https://expressjs.com/en/api.html#req Request}
 */

/**
 * Express Response Object
 *
 * @external Response
 * @see {@link https://expressjs.com/en/api.html#res Response}
 */

/**
 * Class to control the webserver & routes
 */
class Web {

    constructor() {

        if (!config.webserver.port) {
            throw new Error('Must provide a port in config when the webserver is enabled');
        }

        this.app = express();
        this.app.set('view engine', 'ejs');
        this.app.use(morgan("combined", {
            stream: {
                write: (message) => global.logger.info(message)
            }
        }));

        // Routes
        this.app.get('/', this.indexRoute);
        this.app.get('/player/:id', this.playerIdRoute);
        this.app.get('/api/overview', this.ApiOverviewRoute);
        this.app.get('/api/player/:id', this.ApiPlayerInfoRoute);
        this.app.get('/api/historicalData', this.getHistoricalDataRoute);

        this.app.use('/static', express.static(path.resolve(__dirname, '../../static')));
        this.app.listen(port, () => {
            if (cluster.isMaster) {
                global.logger.info(`Webserver listening on port ${port}!`)
            }
        })
    }

    /**
     * Serves the index page
     * @param {external:Request} req 
     * @param {external:Response} res 
     */
    indexRoute(req, res) {
        res.render('index', {
            name: config.serverName
        });
    }

    /**
     * Serves the player profile page
     * @param {external:Request} req 
     * @param {external:Response} res 
     */
    async playerIdRoute(req, res) {
        const player = await global.models.Player.findByPk(req.params.id);

        if (_.isNull(player)) {
            res.status(404)
                .send('No player with that ID found.');
            return res.end();
        }

        res.render('profile', {
            name: config.serverName
        });
    }

    /**
     * Returns general info about all players
     * @param {external:Request} req
     * @param {external:Response} res
     */
    async ApiOverviewRoute(req, res) {
        const data = await global.models.Player.findAll({
            attributes: ['id', 'name', 'score', 'kills', 'deaths', 'headshots', 'steam', 'hits', 'shots'],
            limit: 1000,
            order: [
                ['score', 'DESC']
            ]
        });
        res.json(data);
        return res.end();
    }

    /**
     * Returns current stats for a single player
     * @param {external:Request} req
     * @param {external:Response} res
     */
    async ApiPlayerInfoRoute(req, res) {
        const data = await global.models.Player.findOne({
            attributes: {
                exclude: 'lastip'
            },
            where: {
                id: req.params.id
            }
        });

        if (_.isNull(data)) {
            res.status(404)
                .send('No player with that ID found.');
            return res.end();
        }

        res.json(data);
        return res.end();
    }

    /**
     * 
     * @param {external:Request} req 
     * @param {external:Response} res 
     */
    async getHistoricalDataRoute(req, res) {

        if (_.isUndefined(req.query.endDate)) {
            req.query.endDate = Date.now();
        }

        if (_.isUndefined(req.query.startDate)) {
            // Default to week-old data
            req.query.startDate = Date.now() - 604800000;
        }

        const whereObj = {
            [Op.and]: {
                createdAt: {
                    [Op.gte]: req.query.startDate,
                    [Op.lte]: req.query.endDate
                },
            }
        }

        if (req.query.steam !== undefined) {
            whereObj[Op.and].steam = req.query.steam
        }

        const startDate = new Date(req.query.startDate);
        const endDate = new Date(req.query.endDate);
        const data = await global.models.HistoricalData.findAll({
            where: whereObj,
            raw: true,
        });

        res.json(data);
        return res.end();
    }

}

module.exports = Web;
