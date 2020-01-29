import mongoose , {Schema,Document} from 'mongoose';
const userSchema : Schema = new Schema({
    username: String,
    password: String,
    name: String,
    surname: String,
    address: String,
    phone: String,
    email: String
});
export interface IUser extends Document{
    username: String,
    password: String,
    name: String,
    surname: String,
    address: String,
    phone: String,
    email: String
};

module.exports = mongoose.model('user', userSchema, 'users');