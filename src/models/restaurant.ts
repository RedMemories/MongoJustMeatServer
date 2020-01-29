import mongoose , {Schema,Document} from 'mongoose';
export interface IRestaurant extends Document{
    name: string,
    address: string,
    city: string,
    email: string,
    plates: IPlates[],
    rating: number,
    typology: string
}
export interface IPlates extends Document{
    name : string,
    quantity: number,
    price : number
}
const restaurantSchema: Schema = new Schema({
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
