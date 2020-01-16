import express, { Application } from 'express';
import Users from './routes/users';
import Restaurants from './routes/restaurants';
import Orders from './routes/orders';
import cors from 'cors';
import { dbConnect } from './dbConnection/connection';
import mongoose from 'mongoose';
mongoose.set('debug', true);
mongoose.set('useFindAndModify', false);

const app: Application = express();
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

app.listen(PORT, "Localhost", (err) => {
    if(err) {
        return console.log(err);
    }
    console.log(`Server is running on localhost: ${PORT}`);
});
module.exports = app;