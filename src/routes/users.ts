import express, {Request, Response, Router} from 'express';
import { check, validationResult, param, query } from 'express-validator';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import Bcrypt from "bcryptjs";
import { IUser } from '../models/user';
import { Model } from 'mongoose';
import { verifyToken } from '../JwtVerify/verify';
import { IOrder } from '../models/order';
const router: Router = express.Router();
const User: Model<IUser> = require('../models/user');
const Order: Model<IOrder> = require('../models/order');

router.use(bodyParser.json());

router.get('/:userId/orders', [
    param('userId').exists().isMongoId()
], verifyToken, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let user: IUser | null = await User.findById({ _id: req.params.userId }).exec();
    if(!user) {
        res.status(404).send('User not found');
    }
    await Order.find({ user: req.params.userId}).exec((err: Error, userOrders: IOrder) => {
        if(err) {
            return res.send(err);
        }
        return res.json({userOrders});
    });
});


router.get('/', async (req: Request, res: Response) => {
    if(req.query.username) {
        let user: IUser | null = await User.findOne({ username: req.query.username }).exec();
        return res.json(user);
    }
    if(req.query.id) {
        let user: IUser | null = await User.findById({ _id: req.query.id }).exec();
        return res.json(user);
    }
    await User.find({}).exec((err: Error, users: IUser) => {
        if(err){
           return res.send(err);
        }
        return res.json(users);
    })  
});

router.post('/', [
    check('username').isString(),
    check('password').isLength({ min: 5, max: 15 }),
    check('name').isString(),
    check('surname').isString(),
    check('address').isString(),
    check('email').isEmail()
    //check('phone').isMobilePhone('it-IT')
  ], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        req.body.password = Bcrypt.hashSync(req.body.password, 10);
        let newUser: IUser = new User(req.body);
        let payload: Object;
        if(req.body.username === 'admin') {
            payload = { 
                subject: newUser._id, 
                email: newUser.email, 
                isAdmin: true 
            }
        } else {
            payload = { 
                subject: newUser._id, 
                email: newUser.email, 
                isAdmin: false 
            }
        }
        let token: string = jwt.sign(payload, 'FLIZsTmhpB', {expiresIn: 3600});
        let result: IUser = await newUser.save();
        res.status(201).json({
            user: result,
            token: token
        });
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.post('/login', [
    check('username').exists().isString(),
    check('password').isLength({ min: 5, max: 15 })
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        let user: IUser | null = await User.findOne({ username: req.body.username }).exec();
        if(!user) {
            return res.status(404).send({ message: "The username does not exist" });
        }
        if(!Bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(404).send({ message: "The password is invalid" });
        }
        let payload: Object;
        if(user.username === 'admin') {
            payload = { 
                subject: user.id, 
                username: user.username, 
                isAdmin: true 
            }
        } else {
            payload = { 
                subject: user.id, 
                username: user.username, 
                isAdmin: false 
            }
        }
        let token: string = jwt.sign(payload, 'FLIZsTmhpB', { expiresIn: 3600 });
        res.status(200).json({
            message: `Welcome ${user.name}!`,
            token: token
        });
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.put('/:username', [
    param('username').exists().isString()
], verifyToken, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    await User.findOneAndUpdate({ username: req.params.username }, req.body, { new: true }).exec((err: Error) => {
        if(err) {
            return res.send(err);
        }
        return res.status(200).send('User updated');
    });
});

router.delete('/:username', [
    param('username').exists().isString()
], verifyToken, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    await User.findOneAndDelete({ username: req.params.username }).exec((err: Error, doc: IUser) => {
        if(err) {
            return res.status(404).send(err);
        }
        return res.status(200).json({
            message: 'User deleted',
            document: doc
        });
    });
});

export = router;