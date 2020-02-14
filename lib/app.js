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
const mongoose_1 = __importDefault(require("mongoose"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerDocument = __importStar(require("./swagger.json"));
mongoose_1.default.set('debug', false);
const app = express_1.default();
// const server = http.createServer(app);
// const io = socketIO(server);
const port = process.env.PORT || 3006;
connection_1.dbConnect().then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error(error);
});
app.use(cors_1.default());
app.use('/users', users_1.default);
app.use('/restaurants', restaurants_1.default);
app.use('/orders', orders_1.default);
app.use('/swagger', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
// io.on('connection', (socket: any) => {
//     socket.on('set-name', (name: string) => {
//         console.log('Name: ' + name);
//       socket.status = name;
//       io.emit('status-changed', {status: name, event: 'status updated'});  
//     });
//   });
app.listen(port);
module.exports = app;
