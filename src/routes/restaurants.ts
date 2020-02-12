import express, {Request, Response, Router} from 'express';
import bodyParser from 'body-parser';
import { Model } from 'mongoose';
import { IRestaurant } from '../models/restaurant';
import { IOrder } from '../models/order';
import { validationResult, param, query, check } from 'express-validator';
import { verifyToken } from '../JwtVerify/verify';
import jwt from 'jsonwebtoken';
const router: Router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
const Restaurant: Model<IRestaurant> = require('../models/restaurant');
const Order: Model<IOrder> = require('../models/order');

router.get('/orders', verifyToken, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let header: any = JSON.stringify(jwt.decode(req.headers.authorization as string));
    header = JSON.parse(header);
    let restaurant: IRestaurant | null = await Restaurant.findById({ _id: header.restaurant}).exec();
    if(!restaurant) {
        res.status(404).send('Restaurant not found');
    }
    await Order.find({ restaurant: header.restaurant }).exec((err: Error, restaurantOrders: Array<IOrder>) => {
        if(err) {
            return res.send(err);
        }
        return res.json(restaurantOrders);
    });
});

router.get('/', async (req: Request, res: Response) => {
    if(req.query.id) {
        let restaurant: IRestaurant | null = await Restaurant.findById({ _id: req.query.id }).exec();
        return res.json(restaurant);
    }
    if(req.query.city) {
        let restaurant: Array<IRestaurant> | null = await Restaurant.find({ city: req.query.city }).exec();
        return res.json(restaurant);
    }
    Restaurant.find({}).exec((err: Error, doc: Array<IRestaurant>) => {
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
    check('typology').exists().isString().isIn(['Ristorante', 'Pizzeria', 'Ristorante-Pizzeria'])
], verifyToken, async(req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let restaurant: IRestaurant | null = await Restaurant.findOne({ name: req.body.name }).exec();
    if(restaurant) {
        return res.status(403).json({ message: 'Name already in use' });
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
    await Restaurant.findOneAndUpdate({_id: req.params.id}, req.body, { new: true }).exec((err: Error) => {
        if(err) {
            return res.send(err);
        }
        return res.status(200).send('Restaurant updated');
    });
});

router.put('status/:id', [
    param('id').exists().isMongoId()
    ], verifyToken, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
        }
    if(!req.params.id){
        return res.send('Order id required');
    }
    await Order.findByIdAndUpdate( {_id: req.params.id}, req.body).exec( (err: Error) => {
        if(err) {
            return res.json(err);
        }
        return res.status(200).json({ message: 'Order status updated'});
    });  
});

router.delete('/:id', [
    param('id').exists().isMongoId()
],verifyToken ,async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    await Restaurant.findOneAndDelete({_id: req.params.id}).exec((err: Error, doc: IRestaurant) => {
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