import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoute.js';
dotenv.config();

mongoose.connect(process.env.MONGO_DB).then(()=>{
    console.log('connected to database')
})
const app = express();
app.use(cookieParser())
app.use(express.json())
app.use('/api/auth',authRouter)
app.listen(3000,()=>{
    console.log('listening on port 3000')
})
app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'internal error 1'
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message

    })
})