import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();

mongoose.connect(process.env.MONGO_DB).then(()=>{
    console.log('connected to database')
})
const app = express();
app.use(cookieParser())
app.use(express.json())
app.listen(3000,()=>{
    console.log('listening on port 3000')
})