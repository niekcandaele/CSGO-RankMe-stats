process.env.NODE_ENV = 'test';

const supertest = require('supertest');
const chai = require('chai');
const expect = chai.expect
require('../src/index');
const mock = require('./mock');

const Web = require('../src/classes/web');
const webserver = new Web();

global.app = webserver.app;

describe('Web API', function () {
    describe('/ - index page', function () {

        it('Returns HTML', function () {
            return supertest(global.app)
                .get('/')
                .expect('Content-Type', "text/html; charset=utf-8")
                .expect(200)
        });

    });


    describe('/player/:id - player profile page', function () {

        it('Returns HTML', async function () {
            const mockPlayer = await mock.player();
            return supertest(global.app)
                .get(`/player/${mockPlayer.id}`)
                .expect('Content-Type', "text/html; charset=utf-8")
                .expect(200)
        });

        it('Returns 404 for a unknown player', async function () {
            const mockPlayer = await mock.player();
            return supertest(global.app)
                .get(`/player/${mockPlayer.id + 1}`)
                .expect('Content-Type', "text/html; charset=utf-8")
                .expect(404)
        });

    });
    describe('/api/overview - player profile page', function () {

        it('Returns JSON', async function () {
            return supertest(global.app)
                .get(`/api/overview`)
                .expect('Content-Type', /json/)
                .expect(200)
                .then(response => {
                    const data = JSON.parse(response.text);
                    expect(data).to.be.an('array');
                    expect(data[0]).to.haveOwnProperty('id');
                    expect(data[0]).to.haveOwnProperty('name');
                    expect(data[0]).to.haveOwnProperty('score');
                    expect(data[0]).to.haveOwnProperty('kills');
                    expect(data[0]).to.haveOwnProperty('deaths');
                    expect(data[0]).to.haveOwnProperty('headshots');
                    expect(data[0]).to.not.haveOwnProperty('lastip');
                })
        });

    });

    describe('/api/player/:id - player statistics', function () {

        it('Returns JSON', async function () {
            const mockPlayer = await mock.player();
            return supertest(global.app)
                .get(`/api/player/${mockPlayer.id}`)
                .expect('Content-Type', /json/)
                .expect(200)
                .then(response => {
                    const data = JSON.parse(response.text);
                    expect(data).to.not.haveOwnProperty('lastip');
                })
        });

        it('Returns 404 for a unknown player', async function () {
            const mockPlayer = await mock.player();
            return supertest(global.app)
                .get(`/api/player/${mockPlayer.id}1`)
                .expect(404)
        });

    });
});