"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../utils/prisma");
const errorHandler_1 = require("../middleware/errorHandler");
const getAllUsers = async (req, res) => {
    try {
        const users = await prisma_1.prisma.user.findMany();
        res.json({ success: true, users });
    }
    catch (error) {
        (0, errorHandler_1.handleServerError)(res, error.message);
    }
};
const getAuthenticatedUser = async (req, res) => {
    res.json({ success: true, message: req.user });
};
exports.default = { getAllUsers, getAuthenticatedUser };
