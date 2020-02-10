import mongoose , { Schema,Document } from 'mongoose';
const userSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    password: String,
    name: String,
    surname: String,
    address: String,
    phone: String,
    email: { type: String, required: true, unique: true }
});
export interface IUser extends Document{
    username: string,
    password: string,
    name: string,
    surname: string,
    address: string,
    phone: string,
    email: string
};

module.exports = mongoose.model<IUser>('user', userSchema, 'users');