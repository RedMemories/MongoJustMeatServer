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
const body_parser_1 = __importDefault(require("body-parser"));
const express_validator_1 = require("express-validator");
const verify_1 = require("../JwtVerify/verify");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_1 = require("../app");
const router = express_1.default.Router();
router.use(body_parser_1.default.json());
router.use(body_parser_1.default.urlencoded({ extended: true }));
const Restaurant = require('../models/restaurant');
const Order = require('../models/order');
router.get('/orders', verify_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let header = JSON.stringify(jsonwebtoken_1.default.decode(req.headers.authorization));
    header = JSON.parse(header);
    let restaurant = yield Restaurant.findById({ _id: header.restaurant }).exec();
    if (!restaurant) {
        return res.status(404).send('Restaurant not found');
    }
    if (req.query.id) {
        let restaurantOrder = yield Order.findOne({ restaurant: header.restaurant, _id: req.query.id }).exec();
        if (!restaurantOrder) {
            return res.status(404).send('Order not found');
        }
        return res.json(restaurantOrder);
    }
    yield Order.find({ restaurant: header.restaurant }).exec((err, restaurantOrders) => {
        if (err) {
            return res.send(err);
        }
        return res.json(restaurantOrders);
    });
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.query.id) {
        let restaurant = yield Restaurant.findById({ _id: req.query.id }).exec();
        return res.json(restaurant);
    }
    if (req.query.city) {
        let restaurant = yield Restaurant.find({ city: req.query.city }).exec();
        return res.json(restaurant);
    }
    Restaurant.find({}).exec((err, doc) => {
        if (err) {
            return res.send(err);
        }
        return res.json(doc);
    });
}));
router.post('/', [
    express_validator_1.check('name').exists().isString(),
    express_validator_1.check('address').exists().isString(),
    express_validator_1.check('email').exists().isEmail(),
    express_validator_1.check('plates').isArray({ min: 1 }),
    express_validator_1.check('typology').exists().isString().isIn(['Ristorante', 'Pizzeria', 'Ristorante-Pizzeria'])
], verify_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let restaurant = yield Restaurant.findOne({ name: req.body.name }).exec();
    if (restaurant) {
        return res.status(403).json({ message: 'Name already in use' });
    }
    try {
        let newRestaurant = new Restaurant(req.body);
        let result = yield newRestaurant.save();
        res.status(201).json(result);
    }
    catch (error) {
        return res.status(500).send(error);
    }
}));
router.put('/:id', [
    express_validator_1.param('id').exists().isMongoId()
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    yield Restaurant.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }).exec((err) => {
        if (err) {
            return res.send(err);
        }
        return res.status(200).send('Restaurant updated');
    });
}));
router.put('/:id/status', [
    express_validator_1.param('id').exists().isMongoId()
], verify_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    if (!req.params.id) {
        return res.send('Order id required');
    }
    yield Order.findByIdAndUpdate({ _id: req.params.id }, req.body).exec((err) => {
        if (err) {
            return res.json(err);
        }
        return res.status(200).json({ message: 'Order status updated' });
    }), () => {
        app_1.io.emit("status-changed", { event: "Order status changed" });
        return;
    };
}));
router.delete('/:id', [
    express_validator_1.param('id').exists().isMongoId()
], verify_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    yield Restaurant.findOneAndDelete({ _id: req.params.id }).exec((err, doc) => {
        if (err) {
            return res.send(err);
        }
        return res.status(200).json({
            message: 'Restaurant deleted',
            document: doc
        });
    });
}));
module.exports = router;
