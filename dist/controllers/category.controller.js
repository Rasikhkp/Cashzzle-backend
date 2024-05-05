"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../utils/prisma");
const errorHandler_1 = require("../middleware/errorHandler");
const getAllCategories = async (req, res) => {
    const userId = req.query.userId;
    try {
        const categories = await prisma_1.prisma.category.findMany({ where: { userId } });
        res.json({ success: true, message: categories });
    }
    catch (error) {
        (0, errorHandler_1.handleServerError)(res);
    }
};
const fillCategories = async (req, res) => {
    const categories = req.body;
    try {
        await prisma_1.prisma.category.createMany({
            data: categories
        });
        res.json({ success: true, message: categories });
    }
    catch (error) {
        (0, errorHandler_1.handleServerError)(res, error.message);
    }
};
const addCategory = async (req, res) => {
    try {
        const category = req.body;
        await prisma_1.prisma.category.create({
            data: category
        });
        res.json({ success: true, message: "Category added" });
    }
    catch (error) {
        (0, errorHandler_1.handleServerError)(res, error.message);
    }
};
const updateCategory = async (req, res) => {
    try {
        const category = req.body;
        delete category.id;
        const id = req.params.id;
        await prisma_1.prisma.category.update({
            where: { id },
            data: category
        });
        res.json({ success: true, message: "Category updated" });
    }
    catch (error) {
        (0, errorHandler_1.handleServerError)(res, error.message);
    }
};
const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
        await prisma_1.prisma.category.delete({
            where: { id }
        });
        res.json({ success: true, message: "Category deleted" });
    }
    catch (error) {
        (0, errorHandler_1.handleServerError)(res, error.message);
    }
};
exports.default = {
    addCategory,
    getAllCategories,
    deleteCategory,
    updateCategory,
    fillCategories
};
