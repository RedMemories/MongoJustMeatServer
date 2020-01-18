const app = require('../app');
var assert = require('assert');
const request = require('supertest');

describe('POST user/login', () => {
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
	})
});



