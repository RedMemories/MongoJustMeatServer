import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    jwt.verify(req.query.token, 'FLIZsTmhpB', (err: Error) => {
        err ? res.status(401).send({ message: 'Unauthorized request' }) : next();
    }); 
}