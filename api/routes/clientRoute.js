import express from 'express';
import { getClientDetails } from '../Controllers/clientController.js';


const router = express.Router();

// GET client details by ID
router.get('/client/:clientId', getClientDetails);

export default router;
