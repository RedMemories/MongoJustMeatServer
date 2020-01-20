import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const orderSchema = new Schema({
    userId: String,
    restaurantId: String,
    date: String,
    shippingAddress : String,
    orderItems: [{
        name : String,
        quantity : Number,
        price : Number
        }
    ],
    totalAmount: Number,
    rating : Number,
    statusOrder : Boolean
});

module.exports = mongoose.model('order', orderSchema, 'orders');