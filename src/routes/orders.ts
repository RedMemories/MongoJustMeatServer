import express, {Request, Response, NextFunction, Router} from 'express';
import bodyParser from 'body-parser';
const router: Router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
const Order = require('../models/order');
const User = require('../models/user');
const Restaurant = require('../models/restaurant');

router.post('/register', async (req: Request, res: Response) => {
    try {
        let [user,restaurant] = await Promise.all([User.findOne({ _id: req.body.userId }),Restaurant.findOne({_id:req.body.restaurantId})]);
        if(!user) return res.status(404).send({message: 'User not found'});
        if(!restaurant) return res.status(404).send({message: 'Restaurant not found'});
        let newOrder = new Order(req.body);
        let result = await newOrder.save();
        res.json({
            order: result
        });
    } catch (error) {
        return res.status(500).send(error);
    }
});


export = router;