import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoute.js';
import userRouter from './routes/userRoute.js';
import transactRouter from './routes/transactRoute.js';
import clientRoutes from './routes/clientRoute.js';
import clientRouters from './routes/clientRouters.js';

dotenv.config();

mongoose.connect(process.env.MONGO_DB).then(() => {
  console.log('connected to database');
});

const app = express();

// ✅ Enable CORS for cookie-based auth
app.use(cors({
  origin: 'http://localhost:3000', // ← matches frontend origin
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/transact', transactRouter);
app.use('/api', clientRoutes);
app.use('/api/client', clientRouters)
app.use((err, req, res, next) => {
  console.error('🔥 SERVER ERROR:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'internal error';
  return res.status(statusCode).json({
    success: false, 
    statusCode,
    message
  });
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});
