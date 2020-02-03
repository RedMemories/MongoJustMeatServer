import express, {Request, Response, Router} from 'express';
import bodyParser from 'body-parser';
import { IRestaurant, IPlatesRest } from '../models/restaurant';
import { IOrder, IPlatesOrder } from '../models/order';
import { Model } from 'mongoose';
import { verifyToken } from '../JwtVerify/verify';
import { check, validationResult, param } from 'express-validator';
const router: Router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
const Order: Model<IOrder> = require('../models/order');
const Restaurant: Model<IRestaurant> = require('../models/restaurant');

router.post('/', [
    check('user').isMongoId(),
    check('restaurant').isMongoId(),
    check('shippingAddress').isString(),
    check('orderItems').isArray().notEmpty()
], verifyToken, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
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
        res.status(201).json(result);
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.put('/:id', [
    param('id').exists().isMongoId(),
    check('orderItems').isArray().notEmpty()/* .custom( (orderItems: Array<IPlatesOrder>) => {
        orderItems.forEach( (_plate: IPlatesOrder) => {
                check('plate.*._id').exists().isMongoId(),
                check('plate.*.name').exists().isString(),
                check('plate.*.quantity').exists().isNumeric()
        })
    }) */
    ], verifyToken, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
        }
    if(!req.params.id){
        return res.send('Order id required');
    }
    await Order.findOneAndUpdate( {_id: req.params.id}, req.body).exec( (err: Error) => {
        if(err) {
            return res.send(err);
        }
        return res.status(200).send('Order updated');
    });  
});

router.delete('/:id', [
    param('id').exists().isMongoId()
    ], verifyToken, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
        }
    await Order.findByIdAndDelete( { _id: req.params.id}).exec( (err: Error, doc: IOrder) => {
        if(err){
            return res.send(err);
        }
        return res.status(200).json({
            message: 'Order successful deleted',
            document: doc
        });
    });
});
export = router;