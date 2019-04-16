const config = require('../../config.json');
const Op = require('sequelize').Op;
const _ = require('lodash');
const CronJob = require('cron').CronJob;

/**
 * Class that controls the historical data module
 * It collects the statistics in an interval and saves them to a new table with timestamps
 */
class HistoricalData {

    constructor() {
        const cronjob = new CronJob(config.historicalData.intervalCron, () => {
            this.intervalFunc();
        });
        cronjob.start();

        global.logger.info(`HistoricalData hook started. Next data collection: ${cronjob.nextDate()}. Data older than ${this._getDeleteDate().toLocaleDateString()} ${this._getDeleteDate().toLocaleTimeString()} will be deleted`);
    }

    /**
     * Gathers data from the RankMe database for players that have been online since the set time difference
     * @returns {Promise}
     */
    async gatherData() {
        // Get players that have connected recently
        const dataToAdd = await global.models.Player.findAll({
            raw: true,
        });

        return dataToAdd;
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
            global.logger.info(`Class - HistoricalData : Completed a cycle - ${newData.length} new records and ${deletedInfo} records deleted`)
        } catch (error) {
            global.logger.info(error)
        }
    }

    /**
     * Calculates the date that historicalData should be deleted
     * @returns {Date}
     */
    _getDeleteDate() {
        const deleteDate = new Date(Date.now() - config.historicalData.keepDataForMs);
        return deleteDate;
    }

}

module.exports = HistoricalData;