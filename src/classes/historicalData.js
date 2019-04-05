const config = require('../../config.json');
const Op = require('sequelize').Op;
const _ = require('lodash');

/**
 * Class that controls the historical data module
 * It collects the statistics in an interval and saves them to a new table with timestamps
 */
class HistoricalData {

    constructor() {
        setInterval(() => {
            this.intervalFunc();
        }, config.historicalData.intervalMs);

        console.log(`HistoricalData hook started. Will collect data every ${config.historicalData.intervalMs} ms. Gathering data about players that have connected since ${this._getLastConnectDate().toLocaleDateString()} ${this._getLastConnectDate().toLocaleTimeString()} and data older than ${this._getDeleteDate().toLocaleDateString()} ${this._getDeleteDate().toLocaleTimeString()} will be deleted`);
    }

    /**
     * Gathers data from the RankMe database for players that have been online since the set time difference
     * @returns {Promise}
     */
    gatherData() {
        return global.models.Player.findAll({
            where: {
                lastconnect: {
                    [Op.gt]: Math.trunc(this._getLastConnectDate().valueOf() / 1000),
                }
            },
            raw: true,
        });
    }

    /**
     * Deletes data older than timeDifference set in config.json
     * @returns {Promise}
     */
    deleteOldData() {
        return global.models.HistoricalData.destroy({
            where: {
                createdAt: {
                    [Op.lt]: this._getDeleteDate().valueOf(),
                }
            }
        })
    }

    /**
     * Saves the gathered data from RankMe table to the historicalData table
     * @returns {Promise}
     */
    async saveDataToDatabase(newData) {
        const returnPromises = new Array();
        newData = newData.map(row => {
            row.id = undefined;
            return row;
        })
        for (const dataRow of newData) {
            returnPromises.push(global.models.HistoricalData.create(dataRow));
        }
        return Promise.all(returnPromises);
    }

    /**
     * Function that is called in a loop for gathering data
     */
    async intervalFunc() {
        try {
            const newData = await this.gatherData();
            await this.saveDataToDatabase(newData);
            const deletedInfo = await this.deleteOldData();
            console.log(`Class - HistoricalData : Completed a cycle - ${newData.length} new records and ${deletedInfo} records deleted`)
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Calculates the date that historicalData should be deleted
     * @returns {Date}
     */
    _getDeleteDate() {
        const deleteDate = new Date(Date.now() - config.historicalData.deleteTimeDifference);
        return deleteDate;
    }

    /**
     * Calculates the date a player has to have connected last before being included in historicalData
     * @returns {Date} 
     */
    _getLastConnectDate() {
        const minimumConnectionDate = new Date(Date.now() - config.historicalData.lastConnectDifferenceBeforeCollectingData);
        return minimumConnectionDate;
    }

}

module.exports = HistoricalData;