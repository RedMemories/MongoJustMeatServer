import mongoose , {Schema,Document} from 'mongoose';
export interface IOrder extends Document{
    user: string,
    restaurant: string,
    date: Date ,
    shippingAddress : string,
    orderItems: IPlatesOrder[],
    totalAmount: number,
    rating : number,
    statusOrder : boolean
}

export interface IPlatesOrder extends Document{
    _id: string,
    name : string,
    quantity: number,
    price : number
}

const orderSchema: Schema = new Schema({
    user: { type: String , required: true },
    restaurant: { type: String , required: true },
    date: { type: Date , default: Date.now},
    shippingAddress: { type: String , required: true },
    orderItems: [{
        _id : { type: String , required: true },
        name : String ,
        quantity : Number,
        price : Number
        }
    ],
    totalAmount: { type: Number, default: 0 },
    rating : { type: Number, default: null},
    statusOrder: { type: Boolean, default: false}
});


module.exports = mongoose.model<IOrder>('order', orderSchema, 'orders');