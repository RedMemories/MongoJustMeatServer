import request from 'supertest';
import { Model } from 'mongoose';
import { IRestaurant } from '../models/restaurant';
const app = require('../../lib/app.js');
const Restaurant: Model<IRestaurant> = require('../models/restaurant');

// register test success

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
            typology: 'Restaurant'
		}
		request(app)
        .post('/restaurants')
        .query({
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoiNWUzODQxNGYwM2Y1OWIzYjBjMjU2MzgwIiwiZW1haWwiOiJzaWdub3JlZmlvcmVkb21lbmljb0B0aXNjYWxpLml0IiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNTgwNzQ1MDM5LCJleHAiOjE1ODA3NDg2Mzl9.7vRNls53wI6EsEqCQpa4-USOi_Uy5n_M9CCZjfoD0A8'
        })
		.send(testRestaurant)
		.set('Accept', 'application/json')
		.expect('Content-Type', /json/)
		.expect(201)
		.end(() => {
			Restaurant.findOneAndDelete({ name: testRestaurant.name}).exec(); //delete user after test passed
			done();
		});
	});
	it('expect 403 restaurant name already present in db', (done) => {
		request(app)
        .post('/restaurant')
        .query({
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoiNWUzODQxNGYwM2Y1OWIzYjBjMjU2MzgwIiwiZW1haWwiOiJzaWdub3JlZmlvcmVkb21lbmljb0B0aXNjYWxpLml0IiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNTgwNzQ1MDM5LCJleHAiOjE1ODA3NDg2Mzl9.7vRNls53wI6EsEqCQpa4-USOi_Uy5n_M9CCZjfoD0A8'
        })
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
                name: 'Meat test',
                price: 10
            }],
            typology: 'Restaurant'
		})
		.set('Accept', 'application/json')
		.expect(403, done);
	});
});

describe('GET restaurants/', () => {
	it('test success for restaurants/', (done) => {
		request(app)
		.get('/restaurants')
		.set('Accept', 'application/json')
		.expect('Content-Type', /json/)
		.expect(200, done);
    });
    it('test success with query filter in restaurants/ GET call', (done) => {
        request(app)
        .get('/restaurants')
        .query({ id: '5e2953ff988c1426b65adc4e'})
        .expect('Content-Type', /json/)
		.expect(200, done);
    });
});