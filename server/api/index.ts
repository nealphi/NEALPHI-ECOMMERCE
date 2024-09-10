import express from 'express';
import mongoose from 'mongoose';
import cors from "cors";
import "dotenv/config";
import { userRouter } from './routes/user';
import { productRouter } from './routes/product';
import path from 'path';
import cookieParser from 'cookie-parser';




const app = express();
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//   })
// );

const allowedOrigins = [
  "http://localhost:3000", // Local development URL
  "https://nealphi-ecommerce.vercel.app",
  process.env.CLIENT_URL   // Production client URL from environment variable
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));



app.options('*', cors());



app.use('/user', userRouter);
app.use('/product', productRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/hello', (req, res) => {
  res.json('hello');
});

mongoose.connect(process.env.MONGODB_CONNECTION)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
