import express, { Request, Response } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { prisma } from './prisma';
import { sendVerificationEmail, sendResetPasswordEmail } from './email';
import './auth-strategy/jwt-strategy';
import './auth-strategy/google-strategy';
import { User } from '@prisma/client';

const app = express();
const PORT = 1234;

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(passport.initialize());
app.use(cookieParser());

// Helper function for handling errors
const handleServerError = (res: Response, message = "Internal Server Error", status = 500) => {
    console.error("Error:", message);
    res.status(status).json({ success: false, message });
};

// Routes

// User Registration
app.post("/api/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const token = jwt.sign({ name, email, hashedPassword }, process.env.JWT_SECRET!, { expiresIn: '5m' });

        sendVerificationEmail(name, email, token);

        res.status(201).json({ success: true, message: "Verification email sent (expires in 5 minutes)" });
    } catch (error: any) {
        handleServerError(res);
    }
});

// User Login
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const match = await bcrypt.compare(password, user.password!);

        if (!match) {
            return res.json({ success: false, message: "Email or password incorrect" });
        }

        const accessToken = jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: '15m' });
        const refreshToken = jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: '1y' });

        res.cookie("access-token", accessToken, { httpOnly: true });
        res.cookie("refresh-token", refreshToken, { httpOnly: true });

        res.json({ success: true, message: "Login successful" });
    } catch (error: any) {
        handleServerError(res);
    }
});

// User Logout
app.get("/api/logout", (req, res) => {
    console.log(req.cookies)
    res.clearCookie('access-token');
    res.clearCookie('refresh-token');

    console.log(req.cookies)
    console.log('logout successfull')
    res.json({ success: true, message: "Logout successful" });
});

// Get all users (protected route)
app.get('/api/user', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        res.json({ success: true, message: req.user });
    } catch (error: any) {
        handleServerError(res, "Failed to fetch users", 500);
    }
});

// Refresh Access Token
app.post("/api/refresh-token", async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ success: false, message: "Refresh token is required" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as User;
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const accessToken = jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: "15m" });
        res.json({ success: true, accessToken });
    } catch (error: any) {
        handleServerError(res, "Invalid refresh token", 403);
    }
});

// Verify Email Token
app.post("/api/verify-email", async (req, res) => {
    try {
        const { token } = req.body;
        const { name, email, hashedPassword }: any = jwt.verify(token, process.env.JWT_SECRET!);

        await prisma.user.upsert({
            where: { email },
            update: { name, email, password: hashedPassword },
            create: { name, email, password: hashedPassword },
        });

        res.json({ success: true, message: "Email verified" });
    } catch (error: any) {
        handleServerError(res, error.message);
    }
});

// Forget Password
app.post('/api/forget-password', (req, res) => {
    const { email } = req.body;
    const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: "5m" });

    sendResetPasswordEmail(email, token);
    res.json({ success: true, message: "Reset password link sent (expires in 5 minutes)" });
});

// Reset Password
app.post("/api/new-password", async (req, res) => {
    try {
        const { token, password } = req.body;
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({ where: { email: decoded.email }, data: { password: hashedPassword } });
        res.json({ success: true, message: "Password reset successfully!" });
    } catch (error: any) {
        handleServerError(res, error.message);
    }
});

// Test Cookies Route
app.get("/test-cookies", (req, res) => {
    res.json({ cookies: req.cookies });
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { session: false }), (req: any, res) => {
    const accessToken = jwt.sign(req.user, process.env.JWT_SECRET!, { expiresIn: '15m' })
    console.log("accessToken", accessToken)

    const refreshToken = jwt.sign(req.user, process.env.JWT_SECRET!, { expiresIn: '1y' })
    console.log("refreshToken", refreshToken)

    res.cookie('access-token', accessToken, { httpOnly: true })
    res.cookie('refresh-token', refreshToken, { httpOnly: true })

    res.redirect("http://localhost:3000/app")
});

// Start Server
app.listen(PORT, () => {
    console.log("Server running on port: " + PORT);
});
