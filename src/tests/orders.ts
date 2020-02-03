import request from 'supertest';
import { IOrder } from '../models/order';
import { Model } from 'mongoose';
const app = require('../../lib/app.js');
const Order: Model<IOrder> = require('../models/order');