"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../utils/prisma");
const errorHandler_1 = require("../middleware/errorHandler");
const getAllSpendingLimits = async (req, res) => {
    try {
        const spendingLimits = await prisma_1.prisma.spendingLimit.findMany();
        res.json({ success: true, message: spendingLimits });
    }
    catch (error) {
        (0, errorHandler_1.handleServerError)(res);
    }
};
const fillSpendingLimits = async (req, res) => {
    const spendingLimits = req.body;
    try {
        await prisma_1.prisma.spendingLimit.createMany({
            data: spendingLimits
        });
        res.json({ success: true, message: spendingLimits });
    }
    catch (error) {
        (0, errorHandler_1.handleServerError)(res, error.message);
    }
};
const upsertSpendingLimit = async (req, res) => {
    const spendingLimitData = req.body;
    try {
        await prisma_1.prisma.spendingLimit.upsert({
            where: { date: spendingLimitData.date },
            update: { spendingLimit: spendingLimitData.spendingLimit },
            create: spendingLimitData
        });
        res.json({ success: true, message: "Spending limit upserted" });
    }
    catch (error) {
        (0, errorHandler_1.handleServerError)(res, error.message);
    }
};
const addSpendingLimit = async (req, res) => {
    const spendingLimit = req.body;
    try {
        await prisma_1.prisma.spendingLimit.create({
            data: spendingLimit
        });
        res.json({ success: true, message: "Spending limit added" });
    }
    catch (error) {
        (0, errorHandler_1.handleServerError)(res, error.message);
    }
};
const updateSpendingLimit = async (req, res) => {
    const spendingLimit = req.body;
    delete spendingLimit.id;
    const id = req.params.id;
    try {
        await prisma_1.prisma.spendingLimit.update({
            where: { id },
            data: spendingLimit
        });
        res.json({ success: true, message: "Spending limit updated" });
    }
    catch (error) {
        (0, errorHandler_1.handleServerError)(res, error.message);
    }
};
exports.default = {
    addSpendingLimit,
    getAllSpendingLimits,
    upsertSpendingLimit,
    updateSpendingLimit,
    fillSpendingLimits
};
