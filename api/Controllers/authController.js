import bcryptjs from 'bcryptjs';
import User from '../Models/userModel.js';
import jwt from 'jsonwebtoken'
import { errorHandler } from '../utils/error.js';

export const Registerations = async (req, res, next) => {
  const { username, email, password, phone, gender, address , role } = req.body;

  try {
    // Only check for email if it's provided
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json('User with this email already exists');
      }
    }
    if (role === "admin" || role === "agent") {
  if (!password) {
    return res.status(400).json("Password is required for admins and agents");
  }
}


    const hashedPassword = password ? bcryptjs.hashSync(password, 10) : null;

    const newUser = new User({
      username,
      email: email || null,
      phone,
      password: hashedPassword,
      role: role || "client",
      gender,
      address
    });

    await newUser.save();

    res.status(201).json({
      message: "User created",
      userId: newUser._id
    });

  } catch (error) {
    next(error);
  }
};


export const Signin = async(req, res, next) => {
  try {
    const { email, password } = req.body;
    const validUser = await User.findOne({ email });
console.log('🧪 Email:', email);
console.log('🧪 Found user:', validUser);
    if (!validUser || !bcryptjs.compareSync(password, validUser.password)) {
      return next(errorHandler(400, 'Invalid email or password'));
    }

    const token = jwt.sign(
      { id: validUser._id, role: validUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      })
      .status(200)
      .json(rest);
  } catch (error) {
    console.error(error)
  }
};
export const signOut = async(req,res,next)=>{
    try {
        await res.clearCookie(req.params.id,'access_token')
        res.status(200).json('user signed Out')
    } catch (error) {
        next(error)
    }
}