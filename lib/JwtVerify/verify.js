"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.verifyToken = (req, res, next) => {
    jsonwebtoken_1.default.verify(req.headers.authorization, 'FLIZsTmhpB', (err) => {
        err ? res.status(401).send({ message: 'Unauthorized request' }) : next();
    });
};
