import express from 'express'
import { deleteTransaction, deposit, getAllDeposits, getAllTransactions, getAllWithdrawals, updateTransaction, withdrawFunds } from '../Controllers/allTransactions.js';
import { verifyAdmin, verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// 🔍 Dashboard data fetch
router.get('/getDeposit', verifyToken, getAllDeposits);        // Table or AG Grid pulls deposits
router.get('/getWithdrawal', verifyToken, getAllWithdrawals);  // Table pulls withdrawals

// 💸 Admin-only withdrawal action
router.post('/adminWithdraw', verifyToken,withdrawFunds);     // Enforced in controller (role check)
router.get('/getAllTransactions', verifyToken, getAllTransactions);
// 💰 Admin or agent deposit
router.post('/makeDeposit', verifyToken,deposit);             // Deposit controller handles role check

// 🧹 Transaction deletion (admin/agent only — implement checks inside)
router.delete('/deleteTransactions/:id', verifyToken, deleteTransaction);
router.post('/updateTransaction/:id', verifyAdmin, updateTransaction);


export default router;

