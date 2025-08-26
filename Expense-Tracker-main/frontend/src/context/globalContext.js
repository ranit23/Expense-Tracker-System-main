import React, { useContext, useState, useEffect } from "react";
import axios from 'axios';

const BASE_URL = "http://localhost:8787/api/v1/";

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

    useEffect(() => {
        if (authToken) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
            fetchUserData(); // Fetch user data on token change
        }
    }, [authToken]);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${BASE_URL}users/me`);
            const { user, incomes, expenses } = response.data;
            setUser(user);
            setIncomes(incomes);
            setExpenses(expenses);
            setError(null);
        } catch (err) {
            console.error("Fetch user data error:", err);
            setError(err.response?.data?.message || "Failed to fetch user data");
        }
    };

    const signupUser = async (credentials) => {
        try {
            const response = await axios.post(`${BASE_URL}users/signup`, credentials);
            const { token, user } = response.data;
            localStorage.setItem('authToken', token);
            setAuthToken(token);
            setUser(user);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed");
        }
    };

    const loginUser = async (credentials) => {
        try {
            const response = await axios.post(`${BASE_URL}users/login`, credentials);
            
            if (response?.data) {
                const { token, user } = response.data;
                localStorage.setItem('authToken', token);
                setAuthToken(token);
                setUser(user);
                await fetchUserData();
                setError(null);
            } else {
                setError("Unexpected response format");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    const logoutUser = () => {
        localStorage.removeItem('authToken');
        setAuthToken(null);
        setUser(null);
        setIncomes([]);
        setExpenses([]);
    };

    const deleteUser = async () => {
        try {
            await axios.delete(`${BASE_URL}users/delete`);
            logoutUser();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete account");
        }
    };

    const addIncome = async (income) => {
        try {
            await axios.post(`${BASE_URL}transections/add-income`, income);
            await fetchUserData();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add income");
        }
    };

    const getIncomes = async () => {
        try {
            const response = await axios.get(`${BASE_URL}transections/get-incomes`);
            setIncomes(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch incomes");
        }
    };

    const deleteIncome = async (id) => {
        try {
            await axios.delete(`${BASE_URL}transections/delete-income/${id}`);
            await fetchUserData();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete income");
        }
    };

    const addExpense = async (expense) => {
        try {
            await axios.post(`${BASE_URL}transections/add-expense`, expense);
            await fetchUserData();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add expense");
        }
    };

    const getExpenses = async () => {
        try {
            const response = await axios.get(`${BASE_URL}transections/get-expenses`);
            setExpenses(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch expenses");
        }
    };

    const deleteExpense = async (id) => {
        try {
            await axios.delete(`${BASE_URL}transections/delete-expense/${id}`);
            await fetchUserData();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete expense");
        }
    };

    const uploadBillImage = async (file) => {
        try {
            const formData = new FormData();
            formData.append("billImage", file);

            const response = await axios.post(`${BASE_URL}bills/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${authToken}`,
                },
            });

            return response.data;
        } catch (err) {
            console.error("Image upload error:", err);
            setError(err.response?.data?.message || "Failed to upload image");
        }
    };

    const totalIncome = () => incomes.reduce((total, income) => total + income.amount, 0);

    const totalExpenses = () => expenses.reduce((total, expense) => total + expense.amount, 0);

    const totalBalance = () => totalIncome() - totalExpenses();

    const transactionHistory = () => {
        const history = [...incomes, ...expenses];
        history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return history;
    };

    return (
        <GlobalContext.Provider
            value={{
                user,
                signupUser,
                loginUser,
                logoutUser,
                deleteUser,
                addIncome,
                deleteIncome,
                addExpense,
                deleteExpense,
                incomes,
                expenses,
                getIncomes,
                getExpenses,
                totalExpenses,
                totalIncome,
                totalBalance,
                transactionHistory,
                uploadBillImage, // ✅ Expose upload function
                error,
                setError,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(GlobalContext);
};
