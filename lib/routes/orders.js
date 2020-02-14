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
const verify_1 = require("../JwtVerify/verify");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router.use(body_parser_1.default.json());
router.use(body_parser_1.default.urlencoded({ extended: true }));
const Order = require('../models/order');
const Restaurant = require('../models/restaurant');
router.post('/', [
    express_validator_1.check('user').isMongoId(),
    express_validator_1.check('restaurant').isMongoId(),
    express_validator_1.check('shippingAddress').isString(),
    express_validator_1.check('orderItems').isArray().notEmpty()
], verify_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        let restaurant = yield Restaurant.findById({ _id: req.body.restaurant }).exec();
        let orderPlates = req.body.orderItems;
        orderPlates
            .every((orderPlate) => restaurant.plates.map((restaurantPlate) => restaurantPlate.name)
            .includes(orderPlate.name));
        if (!orderPlates) {
            return res.status(404).send({ message: 'Can\'t order this plates' });
        }
        let newOrder = new Order(req.body);
        newOrder.orderItems.forEach((orderedItem) => {
            restaurant.plates.forEach((plate) => {
                if (plate.name === orderedItem.name) {
                    orderedItem._id = plate._id;
                    orderedItem.price = plate.price;
                }
            });
            newOrder.totalAmount += orderedItem.price * orderedItem.quantity;
        });
        let result = yield newOrder.save();
        res.status(201).json(result);
    }
    catch (error) {
        return res.status(500).send(error);
    }
}));
router.delete('/:id', [
    express_validator_1.param('id').exists().isMongoId()
], verify_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    yield Order.findByIdAndDelete({ _id: req.params.id }).exec((err, doc) => {
        if (err) {
            return res.send(err);
        }
        return res.status(200).json({
            message: 'Order successful deleted',
            document: doc
        });
    });
}));
module.exports = router;
