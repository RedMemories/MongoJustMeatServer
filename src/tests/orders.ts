import request from 'supertest';
const app = require('../../lib/app.js');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoiNWUzODQxNGYwM2Y1OWIzYjBjMjU2MzgwIiwidXNlcm5hbWUiOiJhZG1pbiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTU4MTM1MTQ3MSwiZXhwIjoxNTgxMzU1MDcxfQ.x_ZoNoLirwC-dWGfb7vAROIK4Vv9r0gpBIy3uFyNTK8';

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
        .set('Authorization', token)
        .send(testOrder)
        .set('Accept', 'application/json')
		.expect('Content-Type', /json/)
        .expect(201, done);
    });
});