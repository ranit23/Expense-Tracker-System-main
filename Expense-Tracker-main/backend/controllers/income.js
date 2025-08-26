import IncomeModel from "../models/IncomeModel.js";
import UserModel from "../models/UserModel.js";

// Add Income
export const addIncome = async (req, res) => {
    const { title, amount, category, description, date } = req.body;
    const userId = req.userId; 

    try {
        // Validations
        if (!title || !amount || !category || !description || !date) {
            return res.status(400).json({ message: 'All fields are required!' });
        }
        if (amount < 0 || !amount === 'number') {
            return res.status(400).json({ message: 'Amount must be a positive number!' });
        }

        // Check if user exists
        const user = await UserModel.findById(userId);
        if (!user) return res.status(403).json({ message: 'User not found' });

        const newIncome = new IncomeModel({
            title,
            amount,
            category,
            description,
            date,
            user: userId
        });
        await newIncome.save();
        return res.status(201).json({ message: 'Income Added' });
    } catch (error) {
        return res.status(500).json({ message: 'Error adding income', error: error.message });
    }
};

// Get Incomes
export const getIncomes = async (req, res) => {
    const userId = req.userId;

    try {
        const incomes = await IncomeModel.find({ user: userId }).sort({ createdAt: -1 });
        return res.status(200).json(incomes);
    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Delete Income
export const deleteIncome = async (req, res) => {
    const { id } = req.params;

    try {
        const income = await IncomeModel.findByIdAndDelete(id);
        if (!income) {
            return res.status(404).json({ message: 'Income not found' });
        }
        return res.status(200).json({ message: 'Income Deleted' });
    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
