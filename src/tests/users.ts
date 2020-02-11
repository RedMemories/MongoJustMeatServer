import request from "supertest";
import { IUser } from '../models/user';
import { Model } from "mongoose";
const app = require('../../lib/app.js');
const User: Model<IUser> = require('../models/user');

// register test success

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoiNWUzODQxNGYwM2Y1OWIzYjBjMjU2MzgwIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTU4MTM1MTQ3MSwiZXhwIjoxNTgxMzU1MDcxfQ.x_ZoNoLirwC-dWGfb7vAROIK4Vv9r0gpBIy3uFyNTK8';

describe('POST users', () => {
	it('test success users', (done) => {
		let testUser = {
			username: "test",
			password: "pswtest",
			name: "test",
			surname: "test",
			address: "Via delle Sciare 33",
			phone: "+393286239190",
			email: "test@gmail.com"
		}
		request(app)
		.post('/users')
		.send(testUser)
		.set('Accept', 'application/json')
		.expect('Content-Type', /json/)
		.expect(201)
		.end(async () => {
			await User.findOneAndDelete({ username: testUser.username}).exec();
		});
		done();
	});
	it('expect 403 user already present in db', (done) => {
		request(app)
		.post('/users')
		.send({
			username: "sfsimone99",
			password: "ciaomondo",
			name: "Simone",
			surname: "Signore Fiore",
			address: "Via Veronica 33",
			phone: "340 422 1442",
			email: "simone.signorefiore@gmail.com"
		})
		.set('Accept', 'application/json')
		//.expect('Content-Type', /json/)
		.expect(403, done);
	});
});

describe('PUT users/:username', () => {
	it('expected test success users/:username', (done) => {
		request(app)
		.put('/users/lucreziaragusa99')
		.set('Authorization', token)
		.send({
			username: 'pippo.pulvi',
			name: 'Pippo',
			surname: 'Pulvirenti',
			address: 'Via Genova 15 Roma',
			email: 'pippo.pulvirenti@gmail.com'
		})
		.set('Accept', 'application/json')
		.expect(200, done);
	});
});

describe('POST users/login', () => {
	it('test success users/login', (done) => {
		request(app)
		.post('/users/login')
		.send({
			email: "mario.urso@gmail.com",
			password: "iostudio"
		})
		.set('Accept', 'application/json')
		.expect('Content-Type', /json/)
		.expect(200, done);
	});
	it('login failed for wrong data', (done) => {
		request(app)
		.post('/users/login')
		.send({
			email: "pippo@gmail.com",
			password: "ciaomondo"
		})
		.set('Accept', 'application/json')
		.expect('Content-Type', /json/)
		.expect(404, done);
	});
});

describe('GET users/', () => {
	it('test success for users/', (done) => {
		request(app)
		.get('/users')
		.set('Accept', 'application/json')
		.expect('Content-Type', /json/)
		.expect(200, done);
	});
});



