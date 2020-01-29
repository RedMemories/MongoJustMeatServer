import express, {Request, Response, NextFunction, Router} from 'express';
import bodyParser from 'body-parser';
import { IPlates,IRestaurant} from '../models/restaurant';
import {IOrder} from '../models/order';
import {IUser} from '../models/user'
const router: Router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
const Order = require('../models/order');
const User = require('../models/user');
const Restaurant = require('../models/restaurant');

router.post('/', async (req: Request, res: Response) => {
    try {
        let prova:[IUser ,IRestaurant] = await Promise.all([
            await User.findById({ _id: req.body.user }),
            await Restaurant.findById({_id:req.body.restaurant}),
        ]);
        if(!prova[0]) return res.status(404).send({message: 'User not found'});
        if(!prova[1]) return res.status(404).send({message: 'Restaurant not found'});

        const existPlate = req.body.orderItems
            .every(( orderPlate:IPlates ) => prova[1].plates.map((restaurantPlate:any) => restaurantPlate._id)
            .includes(orderPlate._id));
        if(!existPlate) return res.status(404).send({message: 'Can\'t order this plates'});
        req.body.totalAmount = req.body.orderItems.reduce((total:number, orderPlate:IPlates ) => total + (+orderPlate.price  * +orderPlate.quantity))
        let newOrder = new Order(req.body);
        let result = await newOrder.save();
        res.json({
            result,
        });
    } catch (error) {
        return res.status(500).send(error);
    }
});
export = router;