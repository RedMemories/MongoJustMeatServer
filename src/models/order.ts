import mongoose , {Schema,Document} from 'mongoose';
import {IPlates} from '../models/restaurant'
export interface IOrder extends Document{
    user: string,
    restaurant: string,
    date: Date ,
    shippingAddress : string,
    orderItems: IPlates[],
    totalAmount: number,
    rating : number,
    statusOrder : boolean

}

const orderSchema : Schema = new Schema({
    user: {type : String , required:true},
    restaurant: {type : String , required:true},
    date: {type : Date , default : Date.now},
    shippingAddress : {type : String , required:true},
    orderItems: [{
        _id : {type : String , required:true},
        name : String ,
        quantity : Number,
        price : Number
        }
    ],
    totalAmount: Number,
    rating : {type : Number , default : null},
    statusOrder : Boolean
});


module.exports = mongoose.model<IOrder>('order', orderSchema, 'orders');