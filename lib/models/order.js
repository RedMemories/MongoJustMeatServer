"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const orderSchema = new mongoose_1.Schema({
    user: { type: String, required: true },
    restaurant: { type: String, required: true },
    date: { type: Date, default: Date.now },
    shippingAddress: { type: String, required: true },
    orderItems: [{
            _id: { type: String, default: null },
            name: String,
            quantity: Number,
            price: Number
        }
    ],
    totalAmount: { type: Number, default: 0 },
    rating: { type: Number, default: null },
    statusOrder: {
        type: String,
        enum: ['NEW', 'ACCEPTED', 'SHIPPED', 'DELIVERED'],
        default: 'NEW'
    }
});
module.exports = mongoose_1.default.model('order', orderSchema, 'orders');
