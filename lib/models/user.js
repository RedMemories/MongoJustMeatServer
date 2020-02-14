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
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    password: String,
    name: String,
    surname: String,
    address: String,
    phone: String,
    email: { type: String, required: true, unique: true }
});
;
module.exports = mongoose_1.default.model('user', userSchema, 'users');
