import express, { Application, NextFunction } from 'express';
import Users from './routes/users';
import Restaurants from './routes/restaurants';
import Orders from './routes/orders';
import cors from 'cors';
import { dbConnect } from './dbConnection/connection';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express'
import * as swaggerDocument from './swagger.json'

const app: Application = express();

const PORT = process.env.PORT || 3006;

dbConnect().then(()=> { 
        console.log('Connected to MongoDB');
    }).catch((error: Error) => {
        console.error(error);
    });

app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:8100");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    next();
});

const whitelist = ['http://localhost:3006'];
const corsOptions = {
  credentials: true, // This is important.
  origin: (origin: any, callback: any) => {
    if(whitelist.includes(origin))
      return callback(null, true)

      callback(new Error('Not allowed by CORS'));
  }
}
app.use(cors());
app.use('/users', Users);
app.use('/restaurants', Restaurants);
app.use('/orders', Orders);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}`);
});
module.exports = app;