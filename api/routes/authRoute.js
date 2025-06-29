import express from 'express';
import { Signin, signOut, Signup } from '../Controllers/authController.js';


const router = express.Router();

router.post('/signup',Signup)
router.post('/signin',Signin)
router.post('/signout',signOut)
export default router