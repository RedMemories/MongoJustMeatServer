"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const body_parser_1 = __importDefault(require("body-parser"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const verify_1 = require("../JwtVerify/verify");
const router = express_1.default.Router();
const User = require('../models/user');
const Order = require('../models/order');
const Restaurant = require('../models/restaurant');
router.use(body_parser_1.default.json());
router.get('/:userId/orders', [
    express_validator_1.param('userId').exists().isMongoId()
], verify_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let user = yield User.findById({ _id: req.params.userId }).exec();
    if (!user) {
        res.status(404).send('User not found');
    }
    if (req.query.id) {
        let userOrder = yield Order.findOne({ user: req.params.userId, _id: req.query.id }).exec();
        if (!userOrder) {
            return res.status(404).send('Order not found');
        }
        return res.json(userOrder);
    }
    yield Order.find({ user: req.params.userId }).exec((err, userOrders) => {
        if (err) {
            return res.send(err);
        }
        return res.json(userOrders);
    });
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.query.username) {
        let user = yield User.findOne({ username: req.query.username }).exec();
        return res.json(user);
    }
    if (req.query.id) {
        let user = yield User.findById({ _id: req.query.id }).exec();
        return res.json(user);
    }
    yield User.find({}).exec((err, users) => {
        if (err) {
            return res.send(err);
        }
        return res.json(users);
    });
}));
router.post('/', [
    express_validator_1.check('username').isString(),
    express_validator_1.check('password').isLength({ min: 5, max: 15 }),
    express_validator_1.check('name').isString(),
    express_validator_1.check('surname').isString(),
    express_validator_1.check('address').isString(),
    express_validator_1.check('email').isEmail()
    //check('phone').isMobilePhone('it-IT')
], (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let user = yield User.findOne({ username: req.body.username }).exec();
    if (user) {
        return res.status(403).json({ message: 'Username already in use' });
    }
    let rest = yield Restaurant.findOne({ email: req.body.email }).exec();
    try {
        req.body.password = bcryptjs_1.default.hashSync(req.body.password, 10);
        let newUser = new User(req.body);
        let payload;
        if (rest) {
            payload = {
                subject: newUser._id,
                email: newUser.email,
                isAdmin: true,
                isRestaurant: true,
                restaurant: rest._id
            };
        }
        if (req.body.username === 'admin') {
            payload = {
                subject: newUser._id,
                email: newUser.email,
                isAdmin: true,
                isRestaurant: false,
                restaurant: null
            };
        }
        else {
            payload = {
                subject: newUser._id,
                email: newUser.email,
                isAdmin: false,
                isRestaurant: false,
                restaurant: null
            };
        }
        let token = jsonwebtoken_1.default.sign(payload, 'FLIZsTmhpB', { expiresIn: 3600 });
        let result = yield newUser.save();
        res.status(201).json({
            user: result,
            token: token
        });
    }
    catch (error) {
        return res.status(500).send(error);
    }
}));
router.post('/login', [
    express_validator_1.check('email').exists().isEmail(),
    express_validator_1.check('password').isLength({ min: 5, max: 15 })
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        let user = yield User.findOne({ email: req.body.email }).exec();
        let rest = yield Restaurant.findOne({ email: req.body.email }).exec();
        if (!user) {
            return res.status(404).send({ message: "The username does not exist" });
        }
        if (!bcryptjs_1.default.compareSync(req.body.password, user.password)) {
            return res.status(404).send({ message: "The password is invalid" });
        }
        let payload;
        if (rest) {
            payload = {
                subject: user._id,
                username: user.username,
                isAdmin: false,
                isRestaurant: true,
                restaurant: rest._id
            };
        }
        else if (user.username === 'admin') {
            payload = {
                subject: user._id,
                username: user.username,
                isAdmin: true,
                isRestaurant: false,
                restaurant: null
            };
        }
        else {
            payload = {
                subject: user._id,
                username: user.username,
                isAdmin: false,
                isRestaurant: false,
                restaurant: null
            };
        }
        let token = jsonwebtoken_1.default.sign(payload, 'FLIZsTmhpB', { expiresIn: 3600 });
        res.status(200).json({
            message: `Welcome ${user.name}!`,
            token: token
        });
    }
    catch (error) {
        return res.status(500).send(error);
    }
}));
router.put('/:username', [
    express_validator_1.param('username').exists().isString()
], verify_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    yield User.findOneAndUpdate({ username: req.params.username }, req.body, { new: true }).exec((err, doc) => {
        if (err) {
            return res.send(err);
        }
        return res.status(200).json({
            message: 'User updated',
            user: doc
        });
    });
}));
router.put('/putRating/:restaurantId', [
    express_validator_1.param('restaurantId').exists().isMongoId(),
    express_validator_1.check('rating').isInt({ min: 1, max: 5 })
], verify_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    yield Restaurant.findOneAndUpdate({ _id: req.params.restaurantId }, req.body, { new: true }).exec((err, doc) => {
        if (err) {
            return res.send(err);
        }
        return res.status(200).json({
            message: 'Raiting updated',
            founded: doc
        });
    });
}));
router.delete('/:username', [
    express_validator_1.param('username').exists().isString()
], verify_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    yield User.findOneAndDelete({ username: req.params.username }).exec((err, doc) => {
        if (err) {
            return res.status(404).send(err);
        }
        return res.status(200).json({
            message: 'User deleted',
            document: doc
        });
    });
}));
module.exports = router;
