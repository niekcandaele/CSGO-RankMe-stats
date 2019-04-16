process.env.NODE_ENV = 'test';

const chai = require('chai');
const expect = chai.expect
const Message = require('discord.js').Message;

require('../src/index');
const mock = require('./mock');

const Stats = require('../src/commands/stats/stats');
const Top = require('../src/commands/stats/top');
const Lookup = require('../src/commands/stats/lookup');


describe('Discord bot', function () {
    this.timeout(10000);
    describe('Stats command', function () {

        before(async () => {
            await mock.player();
            await mock.player();
            await mock.player();
            return;
        });

        it('Sends a message', function () {
            return new Promise((resolve, reject) => {
                try {
                    global.discordBot.client.on('ready', async () => {
                        const statsInstance = new Stats(global.discordBot.client);
                        const msg = await global.discordBot.client.channels.get(process.env.TEST_DISCORD_CHANNEL).send(global.discordBot.client.commandPrefix + 'stats');
                        const resultMsg = await statsInstance.run(msg);
                        expect(resultMsg).to.be.instanceOf(Message)
                        return resolve();
                    })
                } catch (error) {
                    return reject(error)
                }
            });
        })

    })
    describe('Top command', function () {

        it('Sends a message', function () {
            return new Promise(async (resolve, reject) => {
                try {
                    const topInstance = new Top(global.discordBot.client);
                    const msg = await global.discordBot.client.channels.get(process.env.TEST_DISCORD_CHANNEL).send(global.discordBot.client.commandPrefix + 'top ak47 10');
                    const resultMsg = await topInstance.run(msg, {
                        type: 'score',
                        amount: 10
                    });
                    expect(resultMsg).to.be.instanceOf(Message)
                    return resolve();
                } catch (error) {
                    return reject(error)
                }
            });
        });
    });


    describe('Lookup command', function () {

        it('Sends a message', function () {
            return new Promise(async (resolve, reject) => {
                try {
                    const player = await mock.player();
                    const lookupInstance = new Lookup(global.discordBot.client);
                    const msg = await global.discordBot.client.channels.get(process.env.TEST_DISCORD_CHANNEL).send(global.discordBot.client.commandPrefix + 'lookup 76561198028175941');
                    let resultMsg = await lookupInstance.run(msg, {
                        steamId: player.steam,
                    });
                    expect(resultMsg).to.be.instanceOf(Message)
                    resultMsg = await lookupInstance.run(msg, {
                        steamId: player.steam.replace('6', '4'),
                    });
                    expect(resultMsg).to.be.instanceOf(Message);
                    return resolve();
                } catch (error) {
                    return reject(error)
                }
            });
        });

        it('Validates argument correctly', function () {
            return new Promise(async (resolve, reject) => {
                try {
                    const lookupInstance = new Lookup(global.discordBot.client);
                    expect(lookupInstance.validateArgument('76561198028175941')).to.be.true;
                    expect(lookupInstance.validateArgument('STEAM_0:1:33955106')).to.be.true;
                    expect(lookupInstance.validateArgument('STEAM_1:1:33955106')).to.be.true;
                    expect(lookupInstance.validateArgument('[U:1:67910213]')).to.be.true;
                    expect(lookupInstance.validateArgument('notavalidID')).to.be.false;
                    return resolve();
                } catch (error) {
                    return reject(error)
                }
            });
        })
    })
})