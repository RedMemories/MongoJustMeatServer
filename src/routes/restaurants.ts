import express, {Request, Response, NextFunction, Router} from 'express';
import bodyParser from 'body-parser';
import { Schema } from 'mongoose';
import { dbConnect } from '../dbConnection/connection';
const router: Router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
const Restaurant = require('../models/restaurant');



router.get('/', async (req: Request, res: Response) => {
    if(req.query.name) {
        let restaurant = await Restaurant.findOne({ name: req.query.name }).exec();
        return res.json(restaurant);
    }
});

router.post('/', async(req: Request, res: Response) => {
    try{
        let restaurant = await Restaurant.findOne({ name: req.body.name }).exec();
        if(restaurant){
            return res.status(403).send({message: 'Restaurant already esist'});
        }else{
            let newRestaurant = new Restaurant(req.body);
            let result = await newRestaurant.save();
            res.json({
                restaurant: result
            });
        }
    }catch(error) {
        return res.status(500).send(error);
    }
});

router.put('/:id', async (req: Request, res: Response) => {
        await Restaurant.findOneAndUpdate({id: req.params._id}, req.body, { new: true }).exec((err: Error, doc: any) => {
            if(err) {
                return res.status(404).send('Restaurant not found...');
            }
            return res.json({
                message: 'Restaurant updated',
                document: doc
        });
    });
});

router.delete('/:id', async (req: Request, res: Response) => {
    await Restaurant.findOneAndDelete({id: req.params._id}).exec((err: Error, doc: any) => {
        if(err) {
            return res.status(404).send(err);
        }
        return res.json({
            message: 'Restaurant deleted',
            document: doc
        });
    });
});

export = router;