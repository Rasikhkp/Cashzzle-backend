import { Response, Request } from "express";
import { prisma } from "../utils/prisma";
import { handleServerError } from "../middleware/errorHandler";

const getAllTransactions = async (req: Request, res: Response) => {
  const userId = req.query.userId as string
  console.log('userId', userId)
  try {
    const transactions = await prisma.transaction.findMany({ where: { userId } })

    res.json({ success: true, message: transactions })
  } catch (error: any) {
    handleServerError(res)
  }
}

const fillTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = req.body

    await prisma.transaction.createMany({
      data: transactions
    })

    res.json({ success: true, message: transactions })
  } catch (error: any) {
    handleServerError(res, error.message)
  }
}

const addTransaction = async (req: Request, res: Response) => {
  try {
    const transaction = req.body
    console.log('transaction', transaction)

    await prisma.transaction.create({
      data: transaction
    })

    res.json({ success: true, message: "Transaction added" })
  } catch (error: any) {
    handleServerError(res, error.message)
  }
}

const updateTransaction = async (req: Request, res: Response) => {
  try {
    const transaction = req.body
    delete transaction.id
    const id = req.params.id

    await prisma.transaction.update({
      where: { id },
      data: transaction
    })

    res.json({ success: true, message: "Transaction updated" })
  } catch (error: any) {
    handleServerError(res, error.message)
  }
}

const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const id = req.params.id

    await prisma.transaction.delete({
      where: { id }
    })

    res.json({ success: true, message: "Transaction deleted" })
  } catch (error: any) {
    handleServerError(res, error.message)
  }
}

export default {
  deleteTransaction,
  updateTransaction,
  addTransaction,
  getAllTransactions,
  fillTransactions
}
