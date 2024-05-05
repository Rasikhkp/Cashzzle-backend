"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../utils/prisma");
const errorHandler_1 = require("../middleware/errorHandler");
const getAllTransactions = async (req, res) => {
    const userId = req.query.userId;
    console.log('userId', userId);
    try {
        const transactions = await prisma_1.prisma.transaction.findMany({ where: { userId } });
        res.json({ success: true, message: transactions });
    }
    catch (error) {
        (0, errorHandler_1.handleServerError)(res);
    }
};
const fillTransactions = async (req, res) => {
    try {
        const transactions = req.body;
        await prisma_1.prisma.transaction.createMany({
            data: transactions
        });
        res.json({ success: true, message: transactions });
    }
    catch (error) {
        (0, errorHandler_1.handleServerError)(res, error.message);
    }
};
const addTransaction = async (req, res) => {
    try {
        const transaction = req.body;
        console.log('transaction', transaction);
        await prisma_1.prisma.transaction.create({
            data: transaction
        });
        res.json({ success: true, message: "Transaction added" });
    }
    catch (error) {
        (0, errorHandler_1.handleServerError)(res, error.message);
    }
};
const updateTransaction = async (req, res) => {
    try {
        const transaction = req.body;
        delete transaction.id;
        const id = req.params.id;
        await prisma_1.prisma.transaction.update({
            where: { id },
            data: transaction
        });
        res.json({ success: true, message: "Transaction updated" });
    }
    catch (error) {
        (0, errorHandler_1.handleServerError)(res, error.message);
    }
};
const deleteTransaction = async (req, res) => {
    try {
        const id = req.params.id;
        await prisma_1.prisma.transaction.delete({
            where: { id }
        });
        res.json({ success: true, message: "Transaction deleted" });
    }
    catch (error) {
        (0, errorHandler_1.handleServerError)(res, error.message);
    }
};
exports.default = {
    deleteTransaction,
    updateTransaction,
    addTransaction,
    getAllTransactions,
    fillTransactions
};
