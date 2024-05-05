import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';
import { handleServerError } from '../middleware/errorHandler';
import { sendVerificationEmail, sendResetPasswordEmail } from '../utils/email';
import { Request, Response } from 'express';
import { User } from '@prisma/client';

const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign({ name, email, hashedPassword }, process.env.JWT_SECRET!, { expiresIn: '5m' });

    sendVerificationEmail(name, email, token);

    res.status(201).json({ success: true, message: "Verification email sent (expires in 5 minutes)" });
  } catch (error: any) {
    handleServerError(res);
  }
};

const loginUser = async (req: Request, res: Response) => {
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

    res.json({ success: true, message: user });
  } catch (error: any) {
    handleServerError(res);
  }
};

const logoutUser = (req: Request, res: Response) => {
  console.log(req.cookies)
  res.clearCookie('access-token');
  res.clearCookie('refresh-token');

  console.log(req.cookies)
  console.log('logout successfull')
  res.json({ success: true, message: "Logout successful" });
};

const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const { name, email, hashedPassword }: any = jwt.verify(token, process.env.JWT_SECRET!);

    await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    res.json({ success: true, message: "Email verified" });
  } catch (error: any) {
    handleServerError(res, error.message);
  }
};

const forgetPassword = (req: Request, res: Response) => {
  const { email } = req.body;
  const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: "5m" });

  sendResetPasswordEmail(email, token);
  res.json({ success: true, message: "Reset password link sent (expires in 5 minutes)" });
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({ where: { email: decoded.email }, data: { password: hashedPassword } });
    res.json({ success: true, message: "Password reset successfully!" });
  } catch (error: any) {
    handleServerError(res, error.message);
  }
};

const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies['refresh-token'];

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

    res.cookie("access-token", accessToken)
    res.json({ success: true, message: "Token refreshed" });
  } catch (error: any) {
    handleServerError(res, "Invalid refresh token", 403);
  }
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  forgetPassword,
  resetPassword,
  refreshToken,
};
