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
        let restaurant: IRestaurant = await Restaurant.findById({_id: req.body.restaurant}).exec() as NonNullable<IRestaurant>;
        let orderPlates: Array<IPlatesOrder> = req.body.orderItems;
        orderPlates
            .every(( orderPlate: IPlatesOrder ) => restaurant.plates.map((restaurantPlate: IPlatesRest) => restaurantPlate.name)
            .includes(orderPlate.name));
        if(!orderPlates) {
            return res.status(404).send({ message: 'Can\'t order this plates' });
        }
        let newOrder: IOrder = new Order(req.body);
        newOrder.orderItems.forEach( (orderedItem: IPlatesOrder) => {
            restaurant.plates.forEach( (plate: IPlatesRest) => {
                if(plate.name === orderedItem.name) {
                    orderedItem._id = plate._id;
                    orderedItem.price = plate.price;
                } 
            });
            newOrder.totalAmount += orderedItem.price * orderedItem.quantity;
        });
        let result = await newOrder.save();
        res.status(201).json(result);
    } catch (error) {
        return res.status(500).send(error);
    }
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