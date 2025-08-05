import express from 'express';

import { getClientDashboard, getClientNotifications } from '../Controllers/clientCtl.js';
import { clientPinVerify } from '../utils/verifyClientPin.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router()

router.get('/me/notifications',verifyToken, getClientNotifications);
router.get('/me/dashboard',verifyToken, getClientDashboard);


export default router