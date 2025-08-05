import express from 'express';

import { getClientDashboard, getClientNotifications } from '../Controllers/clientCtl.js';
import { clientPinVerify } from '../utils/verifyClientPin.js';

const router = express.Router()

router.get('/me/notifications',clientPinVerify, getClientNotifications);
router.get('/me/dashboard',clientPinVerify, getClientDashboard);


export default router