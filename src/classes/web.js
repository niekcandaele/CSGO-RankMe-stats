const config = require('../../config.json');
const express = require('express');
const path = require('path');
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

        // Routes
        this.app.get('/', this.indexRoute);
        this.app.get('/player/:id', this.playerIdRoute);
        this.app.get('/api/overview', this.ApiOverviewRoute);
        this.app.get('/api/player/:id', this.ApiPlayerInfoRoute);

        this.app.use('/static', express.static(path.resolve(__dirname, '../../static')));
        this.app.listen(port, () => console.log(`Webserver listening on port ${port}!`))
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
    playerIdRoute(req, res) {
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
            attributes: ['id', 'name', 'score', 'kills', 'deaths', 'headshots'],
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
        res.json(data);
        return res.end();
    }

}

module.exports = Web;