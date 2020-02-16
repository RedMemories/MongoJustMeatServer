import express, { Application, NextFunction } from 'express';
import Users from './routes/users';
import Restaurants from './routes/restaurants';
import Orders from './routes/orders';
import cors from 'cors';
import { dbConnect } from './dbConnection/connection';
import swaggerUi from 'swagger-ui-express'
import * as swaggerDocument from './swagger.json'
import http from 'http';
import socketIO from 'socket.io';
import { IOrder } from './models/order';
const app: Application = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3006;

dbConnect().then(()=> { 
        console.log('Connected to MongoDB');
    }).catch((error: Error) => {
        console.error(error);
    });

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});

io.on('connection', (socket: socketIO.Socket & {order: IOrder}) => {
  socket.on("disconnect", () => {});

  socket.on('set-name', (order: IOrder) => {
    socket.order = order;
    console.log("Sono dentro socket")
    console.log("socket.order.statusOrder" + socket.order);
    console.log("order.statusOrder" + order);
    io.emit('status-changed', {order, event: 'status updated'});  
  });
});

// const whitelist = ['http://localhost:8100'];
// const corsOptions = {
//   credentials: true, // This is important.
//   origin: (origin: any, callback: any) => {
//     if(whitelist.includes(origin))
//       return callback(null, true)

//       callback(new Error('Not allowed by CORS'));
//   }
// }
app.use(cors());
app.use('/users', Users);
app.use('/restaurants', Restaurants);
app.use('/orders', Orders);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}`);
});

server.listen(4000, () => {});
export {io};
module.exports = app;