import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: String,
    password: String,
    name: String,
    surname: String,
    address: String,
    phone: String,
    email: String
});

module.exports = mongoose.model('user', userSchema, 'users');