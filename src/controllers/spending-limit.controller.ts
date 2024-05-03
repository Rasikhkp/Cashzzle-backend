import { Response, Request } from "express";
import { prisma } from "../utils/prisma";
import { handleServerError } from "../middleware/errorHandler";

const getAllSpendingLimits = async (req: Request, res: Response) => {
  try {
    const spendingLimits = await prisma.spendingLimit.findMany()

    res.json({ success: true, message: spendingLimits })
  } catch (error: any) {
    handleServerError(res)
  }
}

const fillSpendingLimits = async (req: Request, res: Response) => {
  const spendingLimits = req.body

  try {
    await prisma.spendingLimit.createMany({
      data: spendingLimits
    })

    res.json({ success: true, message: spendingLimits })
  } catch (error: any) {
    handleServerError(res, error.message)
  }
}

const upsertSpendingLimit = async (req: Request, res: Response) => {
  const spendingLimitData = req.body

  try {
    await prisma.spendingLimit.upsert({
      where: { date: spendingLimitData.date },
      update: { spendingLimit: spendingLimitData.spendingLimit },
      create: spendingLimitData
    })

    res.json({ success: true, message: "Spending limit upserted" })
  } catch (error: any) {
    handleServerError(res, error.message)
  }
}

const addSpendingLimit = async (req: Request, res: Response) => {
  const spendingLimit = req.body

  try {
    await prisma.spendingLimit.create({
      data: spendingLimit
    })

    res.json({ success: true, message: "Spending limit added" })
  } catch (error: any) {
    handleServerError(res, error.message)
  }
}

const updateSpendingLimit = async (req: Request, res: Response) => {
  const spendingLimit = req.body
  delete spendingLimit.id
  const id = req.params.id

  try {
    await prisma.spendingLimit.update({
      where: { id },
      data: spendingLimit
    })

    res.json({ success: true, message: "Spending limit updated" })
  } catch (error: any) {
    handleServerError(res, error.message)
  }
}

export default {
  addSpendingLimit,
  getAllSpendingLimits,
  upsertSpendingLimit,
  updateSpendingLimit,
  fillSpendingLimits
}
