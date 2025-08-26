import ExpenseModel from "../models/ExpenseModel.js";

// Add Expense
export const addExpense = async (req, res) => {
    const { title, amount, category, description, date } = req.body;
    const userId = req.userId;

    try {
        // Validations
        console.log(title, amount, category, description,date);
        
        if (!title || !amount || !category || !description || !date) {
            return res.status(400).json({ message: 'All fields are required!' });
        }
        if (amount <= 0 || !amount === 'number') {
            return res.status(400).json({ message: 'Amount must be a positive number!' });
        }

        const expense = new ExpenseModel({
            title,
            amount,
            category,
            description,
            date,
            user: userId
        });

        await expense.save();
        return res.status(201).json({ message: 'Expense Added' });
    } catch (error) {
        return res.status(500).json({ message: 'Error adding expense', error: error.message });
    }
};

// Get Expenses
export const getExpenses = async (req, res) => {
    const userId = req.userId;

    try {
        const expenses = await ExpenseModel.find({ user: userId }).sort({ createdAt: -1 });        
        return res.status(200).json(expenses);
    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Delete Expense
export const deleteExpense = async (req, res) => {
    const { id } = req.params;

    try {
        const expense = await ExpenseModel.findByIdAndDelete(id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        return res.status(200).json({ message: 'Expense Deleted' });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
