"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app = require('../../lib/app.js');
const User = require('../models/user');
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
        };
        supertest_1.default(app)
            .post('/users')
            .send(testUser)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .end(() => __awaiter(void 0, void 0, void 0, function* () {
            yield User.findOneAndDelete({ username: testUser.username }).exec();
        }));
        done();
    });
    it('expect 403 user already present in db', (done) => {
        supertest_1.default(app)
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
        supertest_1.default(app)
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
        supertest_1.default(app)
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
        supertest_1.default(app)
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
        supertest_1.default(app)
            .get('/users')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});
