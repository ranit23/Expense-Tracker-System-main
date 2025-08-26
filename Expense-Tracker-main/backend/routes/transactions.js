import { addExpense, getExpenses, deleteExpense } from '../controllers/expense.js';
import { addIncome, getIncomes, deleteIncome } from '../controllers/income.js';
import { Router } from "express";
import { authenticateToken } from '../middlewares/auth.js';

const transectionRoute = Router();

transectionRoute.route('/add-income').post(authenticateToken, addIncome);
transectionRoute.route('/get-incomes').get(authenticateToken, getIncomes);
transectionRoute.route('/delete-income/:id').delete(authenticateToken, deleteIncome);
transectionRoute.route('/add-expense').post(authenticateToken, addExpense);
transectionRoute.route('/get-expenses').get(authenticateToken, getExpenses);
transectionRoute.route('/delete-expense/:id').delete(authenticateToken, deleteExpense);

export default transectionRoute;
