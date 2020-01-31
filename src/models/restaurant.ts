import mongoose , { Schema, Document } from 'mongoose';

const restaurantSchema: Schema = new Schema({
    name: String,
    address: String,
    city: String,
    email: String,
    plates: [{
        name: String,
        quantity : Number,
        price: Number
    }],
    rating: Number,
    typology: String
});

export interface IRestaurant extends Document{
    name: string,
    address: string,
    city: string,
    email: string,
    plates: IPlatesRest[],
    rating: number | null,
    typology: string
}
export interface IPlatesRest extends Document{
    name: string,
    price: number
}

module.exports = mongoose.model('restaurant', restaurantSchema, 'restaurants');
