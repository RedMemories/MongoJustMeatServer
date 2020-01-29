import mongoose , {Schema,Document} from 'mongoose';
export interface IRestaurant extends Document{
    name: String,
    address: String,
    city: String,
    email: String,
    plates: IPlates[],
    rating: Number,
    typology: String
}
export interface IPlates extends Document{
    name : String,
    quantity : number,
    price : number
}
const restaurantSchema : Schema = new Schema({
    name: String,
    address: String,
    city: String,
    email: String,
    plates: [{
        name:String,
        quantity : Number,
        price:Number
    }],
    rating: Number,
    typology: String
});
module.exports = mongoose.model('restaurant', restaurantSchema, 'restaurants');
