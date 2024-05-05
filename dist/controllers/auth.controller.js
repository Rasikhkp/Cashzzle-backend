"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../utils/prisma");
const errorHandler_1 = require("../middleware/errorHandler");
const email_1 = require("../utils/email");
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const token = jsonwebtoken_1.default.sign({ name, email, hashedPassword }, process.env.JWT_SECRET, { expiresIn: '5m' });
        (0, email_1.sendVerificationEmail)(name, email, token);
        res.status(201).json({ success: true, message: "Verification email sent (expires in 5 minutes)" });
    }
    catch (error) {
        (0, errorHandler_1.handleServerError)(res);
    }
};
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        const match = await bcryptjs_1.default.compare(password, user.password);
        if (!match) {
            return res.json({ success: false, message: "Email or password incorrect" });
        }
        const accessToken = jsonwebtoken_1.default.sign(user, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jsonwebtoken_1.default.sign(user, process.env.JWT_SECRET, { expiresIn: '1y' });
        res.cookie("access-token", accessToken, { httpOnly: true });
        res.cookie("refresh-token", refreshToken, { httpOnly: true });
        res.json({ success: true, message: user });
    }
    catch (error) {
        (0, errorHandler_1.handleServerError)(res);
    }
};
const logoutUser = (req, res) => {
    console.log(req.cookies);
    res.clearCookie('access-token');
    res.clearCookie('refresh-token');
    console.log(req.cookies);
    console.log('logout successfull');
    res.json({ success: true, message: "Logout successful" });
};
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;
        const { name, email, hashedPassword } = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        await prisma_1.prisma.user.create({
            data: { name, email, password: hashedPassword },
        });
        res.json({ success: true, message: "Email verified" });
    }
    catch (error) {
        (0, errorHandler_1.handleServerError)(res, error.message);
    }
};
const forgetPassword = (req, res) => {
    const { email } = req.body;
    const token = jsonwebtoken_1.default.sign({ email }, process.env.JWT_SECRET, { expiresIn: "5m" });
    (0, email_1.sendResetPasswordEmail)(email, token);
    res.json({ success: true, message: "Reset password link sent (expires in 5 minutes)" });
};
const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        await prisma_1.prisma.user.update({ where: { email: decoded.email }, data: { password: hashedPassword } });
        res.json({ success: true, message: "Password reset successfully!" });
    }
    catch (error) {
        (0, errorHandler_1.handleServerError)(res, error.message);
    }
};
const refreshToken = async (req, res) => {
    const refreshToken = req.cookies['refresh-token'];
    if (!refreshToken) {
        return res.status(401).json({ success: false, message: "Refresh token is required" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_SECRET);
        const user = await prisma_1.prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const accessToken = jsonwebtoken_1.default.sign(user, process.env.JWT_SECRET, { expiresIn: "15m" });
        res.cookie("access-token", accessToken);
        res.json({ success: true, message: "Token refreshed" });
    }
    catch (error) {
        (0, errorHandler_1.handleServerError)(res, "Invalid refresh token", 403);
    }
};
exports.default = {
    registerUser,
    loginUser,
    logoutUser,
    verifyEmail,
    forgetPassword,
    resetPassword,
    refreshToken,
};
