import express, { Application } from 'express';
import Users from './routes/users';
import Restaurants from './routes/restaurants';
import Orders from './routes/orders';
import cors from 'cors';
import { dbConnect } from './dbConnection/connection';
import mongoose from 'mongoose';
import http from 'http';
import socketIO from 'socket.io';
import swaggerUi from 'swagger-ui-express'
import * as swaggerDocument from './swagger.json'


mongoose.set('debug', false);
mongoose.set('useFindAndModify', false);

const app: Application = express();
const server = http.createServer(app);
const io = socketIO(server);
const PORT = 3006;

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


io.on('connection', (socket: any) => {
   
    socket.on('set-name', (status: string) => {
      socket.status = status;
      io.emit('status-changed', {status, event: 'status updated'});  
    });
  });

app.listen(PORT, "Localhost", (err) => {
    if(err) {
        return console.log(err);
    }
    console.log(`Server is running on localhost: ${PORT}`);
});
module.exports = app;