"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = require("./routes/user");
const product_1 = require("./routes/product");
const cors = require('cors');
const app = (0, express_1.default)();
// Use CORS middleware
app.use(cors({
    origin: 'https://mern-ecommerce-client-ecru.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Handle preflight requests
app.options('*', cors());
app.use(express_1.default.json());
app.use('/user', user_1.userRouter);
app.use('/product', product_1.productRouter);
app.get('/hello', (req, res) => {
    res.json('hello');
});
// Connect to MongoDB
mongoose_1.default.connect('mongodb+srv://neginalipanahi:N1e-g2i%2Fn1368@ecommerce.v1fle7p.mongodb.net/ecommerce')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
