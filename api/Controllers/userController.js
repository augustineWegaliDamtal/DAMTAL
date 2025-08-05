import User from "../Models/userModel.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';

export const updateUser = async(req,res,next)=>{
    if(req.user._id!==req.params.id) return next(errorHandler(400,'you can only update your own account'));
     const { username, email, password, phone,avatar } = req.body;
    try {
        console.log("🔐 Token user _id:", req.user?._id);
console.log("📎 Route param id:", req.params.id);
console.log('📎 Route param id:', req.params.id);
        if (req.body.password) {
  req.body.password = bcryptjs.hashSync(req.body.password, 10);
}
        const updated = await User.findByIdAndUpdate(req.params.id,{
            username,
            email,
            password,
            phone,
           avatar
        },{new:true})
        const {password:pass,...rest} = updated._doc
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async(req,res,next)=>{
    if(req.user._id!==req.params.id) return next(errorHandler(500,'unauthorized access'))
        try {
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json('user deleted')
        } catch (error) {
            next(error)
        }
}