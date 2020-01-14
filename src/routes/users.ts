import express, {Request, Response, NextFunction, Router} from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Bcrypt from "bcryptjs";
import { User } from '../interfaces/userI';
const router: Router = express.Router();
const UserModel = require('../models/user');
router.use(bodyParser.json());
const db = 'mongodb+srv://domenicosf:admin@cluster0-baygv.mongodb.net/justmeatdb?retryWrites=true&w=majority';
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if(err) {
        console.error(`${err}`);
    } else {
        console.log('Connected to MongoDB');
    }
})

router.post('/register', async (req: Request, res: Response) => {
    try {
        let user = await UserModel.findOne({ username: req.body.username }).exec();
        if(user.username === req.body.username){
            return res.status(403).send({message: 'Username already in use'});
        }
        req.body.password = Bcrypt.hashSync(req.body.password, 10);
        let newUser = new UserModel(req.body);
        let payload;
        if(req.body.username === 'admin') {
            payload = { 
                subject: newUser._id, 
                username: newUser.username, 
                isAdmin: true 
            }
        } else {
            payload = { 
                subject: newUser._id, 
                username: newUser.username, 
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
        let user = await UserModel.findOne({ username: req.body.username }).exec();
        if(!user) {
            return res.status(400).send({ message: "The username does not exist" });
        }
        if(!Bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(400).send({ message: "The password is invalid" });
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
})



export = router;