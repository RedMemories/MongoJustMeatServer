"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("./routes/users"));
const restaurants_1 = __importDefault(require("./routes/restaurants"));
const orders_1 = __importDefault(require("./routes/orders"));
const cors_1 = __importDefault(require("cors"));
const connection_1 = require("./dbConnection/connection");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerDocument = __importStar(require("./swagger.json"));
const app = express_1.default();
const PORT = process.env.PORT || 3006;
connection_1.dbConnect().then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error(error);
});
app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:8100");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});
const whitelist = ['http://localhost:3006'];
const corsOptions = {
    credentials: true,
    origin: (origin, callback) => {
        if (whitelist.includes(origin))
            return callback(null, true);
        callback(new Error('Not allowed by CORS'));
    }
};
app.use(cors_1.default());
app.use('/users', users_1.default);
app.use('/restaurants', restaurants_1.default);
app.use('/orders', orders_1.default);
app.use('/swagger', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}`);
});
module.exports = app;
