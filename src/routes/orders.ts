import express, {Request, Response, NextFunction, Router} from 'express';
import bodyParser from 'body-parser';
import { IRestaurant, IPlatesRest } from '../models/restaurant';
import { IOrder, IPlatesOrder } from '../models/order';
import { Model } from 'mongoose';
import { verifyToken } from '../JwtVerify/verify';
const router: Router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
const Order: Model<IOrder> = require('../models/order');
const Restaurant: Model<IRestaurant> = require('../models/restaurant');

router.post('/', verifyToken, async (req: Request, res: Response) => {
    try {
        let restaurant: IRestaurant | any = await Restaurant.findById({_id: req.body.restaurant}).exec();
            const existPlates: Boolean = req.body.orderItems
            .every(( orderPlate: IPlatesOrder ) => restaurant.plates.map((restaurantPlate: IPlatesRest) => restaurantPlate._id)
            .includes(orderPlate._id));
        if(!existPlates) {
            return res.status(404).send({ message: 'Can\'t order this plates' });
        }
        let newOrder = new Order(req.body);
        let orderItems: Array<IPlatesOrder> = req.body.orderItems;
        orderItems.forEach( (item: IPlatesOrder) => {
            restaurant.plates.forEach( (plate: IPlatesOrder) => {
                item.price = plate.price;
            });
            newOrder.totalAmount += item.price * item.quantity;
        });
        let result = await newOrder.save();
        res.json({ result });
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.put('/:id', verifyToken, async (req: Request, res: Response) => {
    await Order.findOneAndUpdate( {_id: req.params.id}, req.body).exec( (err: Error) => {
        if(err){
            return res.status(404).send('Order not found');
        }
        return res.send('Order successful update');
    });
});

router.delete('/:id', verifyToken, async (req: Request, res: Response) => {
    await Order.findByIdAndDelete( { _id: req.params.id}).exec( (err: Error, doc: IOrder) => {
        if(err){
            return res.status(404).send('Order not found');
        }
        return res.json({
            message: 'Order successful deleted',
            document: doc
        });
    });
});
export = router;