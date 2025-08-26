import userModel from "../models/UserModel.js";
import IncomeModel from "../models/IncomeModel.js";
import ExpenseModel from "../models/ExpenseModel.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET;

 const getUserData = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const incomes = await IncomeModel.find({ user: userId });
        const expenses = await ExpenseModel.find({ user: userId });

        return res.status(200).json({
            user,
            incomes,
            expenses
        });
    } catch (err) {
        console.error("Error fetching user data:", err);
        return res.status(500).json({ message: "Failed to fetch user data", error: err.message });
    }
};

const signUp = async (req, res) => {
    const { username, password, mobileNumber } = req.body;
    console.log(username);
    

    if (!username || !password || !mobileNumber) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingUser = await userModel.findOne({ mobileNumber });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            password: encryptedPassword,
            mobileNumber
        });

        const token = jwt.sign({ userId: user._id, mobileNumber: user.mobileNumber }, JWT_SECRET, { expiresIn: '1h' });

        return res.status(201).json({
            message: `${user.username} with ID: ${user._id} is created successfully`,
            token,
            user
        });
    } catch (err) {
        console.error("User creation error:", err);
        return res.status(500).json({ message: "User creation failed", error: err.message });
    }
};

const login = async (req, res) => {
    const { mobileNumber, password } = req.body;

    if (!mobileNumber || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await userModel.findOne({ mobileNumber });

        if (!user) {
            return res.status(403).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Password mismatched" });
        }

        const token = jwt.sign({ userId: user._id, mobileNumber: user.mobileNumber }, JWT_SECRET, { expiresIn: '1h' });

        // Fetch user's incomes and expenses
        const incomes = await IncomeModel.find({ user: user._id });
        const expenses = await ExpenseModel.find({ user: user._id });

        return res.status(200).json({
            status: true,
            message: `${user.username} successfully logged in`,
            token,
            user,
            incomes,
            expenses
        });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Login failed", error: err.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.userId; 

        // Ensure userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        // Delete user and related data (e.g., incomes and expenses)
        const user = await userModel.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await IncomeModel.deleteMany({ user: userId });
        await ExpenseModel.deleteMany({ user: userId });

        res.status(200).json({ message: 'Account and related data deleted successfully' });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ error: 'Failed to delete account' });
    }
};


export { signUp, login, getUserData, deleteUser};
