import express, {Request, Response, NextFunction, Router} from 'express';
import { check, validationResult } from 'express-validator';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import Bcrypt from "bcryptjs";
import { IUser } from '../models/user';
import { Model } from 'mongoose';
const router: Router = express.Router();
const User: Model<IUser> = require('../models/user');

router.use(bodyParser.json());

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    jwt.verify(req.query.token, 'FLIZsTmhpB', (err: Error) => {
        err ? res.status(401).send({ message: 'Unauthorized request' }) : next();
    }); 
}

router.get('/', async (req: Request, res: Response) => {
    if(req.query.username) {
        let user = await User.findOne({ username: req.query.username }).exec();
        return res.json(user);
    }
    if(req.query.id) {
        let user = await User.findById({ _id: req.query.id }).exec();
        return res.json(user);
    }
    await User.find({}).exec((err: Error, users: any) => {
        if(err){
           return res.send(err);
        }
        return res.json(users);
    })
    
});

router.post('/', [
    check('email').isEmail(),
    check('password').isLength({ min: 5 })
  ], async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        console.log('errors:', errors);
        if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
        }
        let user = await User.findOne({ username: req.body.username }).exec();
        if(user){
            return res.status(403).send({message: 'Username already in use'});
        }
        req.body.password = Bcrypt.hashSync(req.body.password, 10);
        let newUser = new User(req.body);
        let payload;
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
        let token = jwt.sign(payload, 'FLIZsTmhpB', {expiresIn: 3600});
        let result = await newUser.save();
        res.json({
            user: result,
            token: token
        });
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.post('/login', async (req: Request, res: Response) => {
    try {
        let user = await User.findOne({ username: req.body.username }).exec();
        if(!user) {
            return res.status(404).send({ message: "The username does not exist" });
        }
        if(!Bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(404).send({ message: "The password is invalid" });
        }
        let payload;
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
        let token = jwt.sign(payload, 'FLIZsTmhpB', { expiresIn: 3600 });
        res.json({
            message: `Welcome ${user.name}!`,
            token: token
        });
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.put('/:username', verifyToken, async (req: Request, res: Response) => {
    await User.findOneAndUpdate({ username: req.params.username }, req.body, { new: true }).exec((err: Error, doc: IUser) => {
        if(err) {
            return res.status(404).send('User not found...');
        }
        return res.json({
            message: 'User updated',
            document: doc
        });
    });
});

router.delete('/:username', verifyToken, async (req: Request, res: Response) => {
    await User.findOneAndDelete({ username: req.params.username }).exec((err: Error, doc: IUser) => {
        if(err) {
            return res.status(404).send(err);
        }
        return res.json({
            message: 'User deleted',
            document: doc
        });
    });
});


export = router;