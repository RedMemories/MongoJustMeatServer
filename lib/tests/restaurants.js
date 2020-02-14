"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app = require('../../lib/app.js');
const Restaurant = require('../models/restaurant');
// register test success
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoiNWUzODQxNGYwM2Y1OWIzYjBjMjU2MzgwIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTU4MTM1MTQ3MSwiZXhwIjoxNTgxMzU1MDcxfQ.x_ZoNoLirwC-dWGfb7vAROIK4Vv9r0gpBIy3uFyNTK8';
describe('POST restaurant', () => {
    it('test success restaurant', (done) => {
        let testRestaurant = {
            name: "testRestaurant",
            address: "Via delle Sciare 33",
            city: "Genova",
            email: "test@gmail.com",
            plates: [{
                    name: "Pasta test",
                    price: 4
                },
                {
                    name: 'Meat test',
                    price: 10
                }],
            typology: 'Ristorante'
        };
        supertest_1.default(app)
            .post('/restaurants')
            .set('Authorization', token)
            .send(testRestaurant)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .end(() => {
            Restaurant.findOneAndDelete({ name: testRestaurant.name }).exec(); //delete user after test passed	
        });
        done();
    });
    it('expect 403 restaurant name already present in db', (done) => {
        supertest_1.default(app)
            .post('/restaurants')
            .set('Authorization', token)
            .send({
            name: "Pizza Rock",
            address: "Via delle Sciare 33",
            city: "Genova",
            email: "test@gmail.com",
            plates: [{
                    name: "Pasta test",
                    price: 4
                },
                {
                    name: 'Carne test',
                    price: 10
                }],
            typology: 'Ristorante'
        })
            .set('Accept', 'application/json')
            .expect(403, done);
    });
});
describe('GET restaurants/', () => {
    it('test success for restaurants/', (done) => {
        supertest_1.default(app)
            .get('/restaurants')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
    it('test success with query filter in restaurants/ GET call', (done) => {
        supertest_1.default(app)
            .get('/restaurants')
            .query({ id: '5e2953ff988c1426b65adc4e' })
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});
describe('PUT restaurants/:id', () => {
    it('expected test success update restaurants/:id', (done) => {
        supertest_1.default(app)
            .put('/restaurants/5e394207d4bdd2b738e951e1')
            .send({
            address: 'Via Genova 15',
            email: 'pizzeriaroma@gmail.com',
            plates: [
                {
                    name: 'Pasta carbonara',
                    price: 10
                },
                {
                    name: 'Bistecca fiorentina',
                    price: 18
                }
            ]
        })
            .set('Accept', 'application/json')
            .expect(200, done);
    });
});
describe('PUT call /confirm', () => {
    it('Order successifull updated', (done) => {
        supertest_1.default(app)
            .put('/restaurants/confirm/5e4183262e2d22195776948c')
            .set('Authorization', token)
            .send({ statusOrder: true })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});
