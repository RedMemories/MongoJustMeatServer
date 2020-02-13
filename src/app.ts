import express, { Application } from 'express';
import Users from './routes/users';
import Restaurants from './routes/restaurants';
import Orders from './routes/orders';
import cors from 'cors';
import { dbConnect } from './dbConnection/connection';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express'
import * as swaggerDocument from './swagger.json'
import http from 'http';
import socketIO from 'socket.io';


mongoose.set('debug', false);

const app: Application = express();
// const server = http.createServer(app);
// const io = socketIO(server);
const port = process.env.PORT || 3006;

dbConnect().then(()=> { 
        console.log('Connected to MongoDB');
    }).catch((error: Error) => {
        console.error(error);
    });

app.use(cors());
app.use('/users', Users);
app.use('/restaurants', Restaurants);
app.use('/orders', Orders);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// io.on('connection', (socket: any) => {
//     socket.on('set-name', (name: string) => {
//         console.log('Name: ' + name);
//       socket.status = name;
//       io.emit('status-changed', {status: name, event: 'status updated'});  
//     });
//   });

app.listen(port);
module.exports = app;