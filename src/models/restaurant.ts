import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const restaurantSchema = new Schema({
    name: String,
    address: String,
    city: String,
    email: String,
    plate: [{
        name:String,
        price:Number
    }],
    rating: Number,
    typology: String
});
module.exports = mongoose.model('restaurant', restaurantSchema, 'restaurants');
