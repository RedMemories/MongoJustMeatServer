import mongoose , { Schema, Document } from 'mongoose';

const restaurantSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    address: { type: String, required: true, unique: true },
    city: String,
    email: { type: String, required: true, unique: true },
    plates: [{
        name: String,
        quantity : Number,
        price: Number
    }],
    rating: { type: Number, default: 0},
    typology: String
});

export interface IRestaurant extends Document{
    name: string,
    address: string,
    city: string,
    email: string,
    plates: IPlatesRest[],
    rating: number,
    typology: string
}
export interface IPlatesRest extends Document{
    name: string,
    price: number
}

module.exports = mongoose.model('restaurant', restaurantSchema, 'restaurants');
