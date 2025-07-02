import express from 'express';
import { Registerations, Signin, signOut, } from '../Controllers/authController.js';


const router = express.Router();

router.post('/signup',Registerations)
router.post('/signin',Signin)
router.post('/signout',signOut)
export default router