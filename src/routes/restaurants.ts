import express, {Request, Response, Router} from 'express';
import bodyParser from 'body-parser';
import { Model } from 'mongoose';
import { IRestaurant } from '../models/restaurant';
import { IOrder } from '../models/order';
import { validationResult, param, query, check } from 'express-validator';
import { verifyToken } from '../JwtVerify/verify';
const router: Router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
const Restaurant: Model<IRestaurant> = require('../models/restaurant');
const Order: Model<IOrder> = require('../models/order');

router.get('/:restaurantId/orders', [
    param('restaurantId').exists().isMongoId()
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let restaurant: IRestaurant | null = await Restaurant.findById({ _id: req.params.restaurantId }).exec();
    if(!restaurant) {
        res.status(404).send('Restaurant not found');
    }
    await Order.find({ restaurant: req.params.restaurantId}).exec((err: Error, restaurantOrders: IOrder) => {
        if(err) {
            return res.send(err);
        }
        return res.json(restaurantOrders);
    });
});

router.get('/', [
    query('name').exists().isString()
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    if(req.query.name) {
        let restaurant = await Restaurant.findOne({ name: req.query.name }).exec();
        return res.json(restaurant);
    }
    Restaurant.find({}).exec((err: Error, doc: IRestaurant) => {
        if(err) {
            return res.send(err);
        }
        return res.json(doc);
    });
});

router.post('/', [
    check('name').exists().isString(),
    check('address').exists().isString(),
    check('email').exists().isEmail(),
    check('plates').isArray( {min: 1} ),
    check('typology').exists().isString()
], verifyToken, async(req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        let newRestaurant: IRestaurant = new Restaurant(req.body);
        let result: IRestaurant = await newRestaurant.save();
        res.status(201).json(result);
    } catch(error) {
        return res.status(500).send(error);
    }
});

router.put('/:id', [
    param('id').exists().isMongoId()
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    await Restaurant.findOneAndUpdate({id: req.params._id}, req.body, { new: true }).exec((err: Error) => {
        if(err) {
            return res.send(err);
        }
        return res.status(200).send('Restaurant updated');
    });
});

router.delete('/:id', [
    param('id').exists().isMongoId()
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    await Restaurant.findOneAndDelete({id: req.params._id}).exec((err: Error, doc: IRestaurant) => {
        if(err) {
            return res.send(err);
        }
        return res.status(200).json({
            message: 'Restaurant deleted',
            document: doc
        });
    });
});

export = router;