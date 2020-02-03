const app = require('../../lib/app.js');
const request = require('supertest');
const User = require('../../lib/models/user.js');

// register test success

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
		.end(() => {
			User.findOneAndDelete({ username: testUser.username}).exec(); //delete user after test passed
			done();
		});
	});
	it('expect 403 user already present in db', (done) => {
		const testFailUser = {
			username: "sfsimone99",
			password: "ciaomondo",
			name: "Simone",
			surname: "Signore Fiore",
			address: "Via Veronica 33",
			phone: "340 422 1442",
			email: "simone.signorefiore@gmail.com"
		}
		request(app)
		.post('/users')
		.send(testFailUser)
		.set('Accept', 'application/json')
		.expect('Content-Type', /json/)
		.expect(403, done);
	});
});

describe('POST users/login', () => {
	it('test success users/login', (done) => {
		let loginTest = {
			username: "annaromatteo99",
			password: "iostudio"
		}
		request(app)
		.post('/users/login')
		.send(loginTest)
		.set('Accept', 'application/json')
		.expect('Content-Type', /json/)
		.expect(200, done);
	});
	it('login failed for wrong data', (done) => {
		let loginTest = {
			username: "pippo",
			password: "ciaomondo"
		}
		request(app)
		.post('/users/login')
		.send(loginTest)
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



