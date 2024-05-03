import { prisma } from '../utils/prisma';
import { handleServerError } from '../middleware/errorHandler';
import { Request, Response } from 'express';

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ success: true, users });
  } catch (error: any) {
    handleServerError(res, error.message);
  }
};

const getAuthenticatedUser = async (req: Request, res: Response) => {
  res.json({ success: true, message: req.user })
}

export default { getAllUsers, getAuthenticatedUser };
