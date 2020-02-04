import request from 'supertest';
const app = require('../../lib/app.js');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoiNWUzODQxNGYwM2Y1OWIzYjBjMjU2MzgwIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTU4MDgyOTMxMSwiZXhwIjoxNTgwODMyOTExfQ.GZC-_NSbqmV6XWb2C_uz744Go0b4UTiHfCi4sOv78Mg';

describe('POST call /orders', () => {
    it('Order create success', (done) => {
        let testOrder = {
            user: "5e20af6225ba6a0dec004154",
	        restaurant: "5e394207d4bdd2b738e951e1",
	        shippingAddress: "Via Nocilla 33",
	        orderItems: [
                {
			        name: "Pasta carbonara",
			        quantity: 2
                },
                {
                    name: "Bistecca fiorentina",
                    quantity: 3
                }
            ]
        }
        request(app)
        .post('/orders')
        .query({
                token: token
            })
        .send(testOrder)
        .set('Accept', 'application/json')
		.expect('Content-Type', /json/)
        .expect(201, done);
    });
});

describe('PUT call /orders', () => {
    it('Order successifull updated', (done) => {
        request(app)
        .put('/orders/5e3983d7e94b611fbf795897')
        .query({
            token: token
        })
        .send({ statusOrder: true })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
});