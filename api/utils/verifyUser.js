import { errorHandler } from "./error.js";
import jwt from 'jsonwebtoken';

export const verifyToken = async(req,res,next)=>{
    const token = req.cookies.access_token;
    if(!token) return next(errorHandler(500,'no token found'))
        jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
    if(err) return next(errorHandler(500,'no token found'))
        req.user = user;
    next();
        })
}