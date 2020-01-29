import express, {Request, Response, NextFunction, Router} from 'express';
import bodyParser from 'body-parser';
import { IPlates, IRestaurant } from '../models/restaurant';
import {IOrder} from '../models/order';
import {IUser} from '../models/user'
import { Model } from 'mongoose';
const router: Router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
const Order: Model<IOrder> = require('../models/order');
const User = require('../models/user');
const Restaurant = require('../models/restaurant');

router.get('/', async (req: Request, res: Response) => {
    if(req.query.id){
        let order = await Order.findById({ _id: req.query.id }).exec();
        return res.json(order);
    }
    Order.find({}).exec( (err: Error, doc: IOrder) => {
        if(err) {
            return res.status(500).send(err);
        }
        return res.json({doc});
    })
})

router.post('/', async (req: Request, res: Response) => {
    try {
        let data:[IUser ,IRestaurant] = await Promise.all([
            await User.findById({ _id: req.body.user }),
            await Restaurant.findById({_id:req.body.restaurant}),
        ]);
        if(!data[0]) return res.status(404).send({message: 'User not found'});
        if(!data[1]) return res.status(404).send({message: 'Restaurant not found'});
        const existPlate = req.body.orderItems
            .every(( orderPlate: IPlates ) => data[1].plates.map((restaurantPlate: any) => restaurantPlate._id)
            .includes(orderPlate._id));
        if(!existPlate) return res.status(404).send({message: 'Can\'t order this plates'});
        req.body.totalAmount = req.body.orderItems.reduce((total: number, orderPlate: IPlates ) => total + (+orderPlate.price  * +orderPlate.quantity))
        let newOrder = new Order(req.body);
        let result = await newOrder.save();
        res.json({
            result,
        });
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    await Order.findOneAndUpdate( {_id: req.params.id}, req.body).exec( (err: Error, doc: IOrder) => {
        if(err){
            return res.status(404).send('Order not found');
        }
        res.json({
            message: 'Order successful update',
            document: doc
        });
    });
});

router.delete('/:id', async (req: Request, res: Response) => {
    await Order.findByIdAndDelete( { _id: req.params.id}).exec( (err: Error, doc: IOrder) => {
        if(err){
            return res.status(404).send('Order not found');
        }
        res.json({
            message: 'Order successful deleted',
            document: doc
        });
    })
})
export = router;