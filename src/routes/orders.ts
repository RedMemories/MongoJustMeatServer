import express, {Request, Response, NextFunction, Router} from 'express';
import bodyParser from 'body-parser';
const router: Router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));



export = router;