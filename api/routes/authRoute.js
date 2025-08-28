import express from 'express';
import { checkClientStatus, loginClient, logoutClient, Registerations, setPinClient, Signin, signOut, } from '../Controllers/authController.js';
import { verifyToken } from '../utils/verifyUser.js';


const router = express.Router();

router.post('/register',verifyToken,Registerations)
router.post('/signin',Signin)
router.post('/signout',signOut)
router.get('/status/:accountNumber',checkClientStatus)
router.post('/setPin',setPinClient)
router.post('/clientLogin',loginClient)
router.post('/logout',logoutClient)
export default router