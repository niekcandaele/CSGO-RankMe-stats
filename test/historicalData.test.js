process.env.NODE_ENV = 'test';

const chai = require('chai');
const expect = chai.expect

require('../src/index');
const mock = require('./mock');
const randomNumber = require('lodash').random;

const HistoricalData = require('../src/classes/historicalData');
const historicalData = new HistoricalData();

describe('Historical data module', function () {
    describe('gatherData', function () {
        it('returns a Promise that resolves to an array', async function () {
            let mockPlayer = await mock.player();
            mockPlayer.lastconnect = Date.now() + randomNumber();
            let data = await historicalData.gatherData();
            return expect(data).to.be.an('array');
        })
    })
})