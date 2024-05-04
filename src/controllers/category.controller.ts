import { Response, Request } from "express";
import { prisma } from "../utils/prisma";
import { handleServerError } from "../middleware/errorHandler";

const getAllCategories = async (req: Request, res: Response) => {
  const userId = req.query.userId as string
  try {
    const categories = await prisma.category.findMany({ where: { userId } })

    res.json({ success: true, message: categories })
  } catch (error: any) {
    handleServerError(res)
  }
}

const fillCategories = async (req: Request, res: Response) => {
  const categories = req.body
  try {
    await prisma.category.createMany({
      data: categories
    })

    res.json({ success: true, message: categories })
  } catch (error: any) {
    handleServerError(res, error.message)
  }
}

const addCategory = async (req: Request, res: Response) => {
  try {
    const category = req.body

    await prisma.category.create({
      data: category
    })

    res.json({ success: true, message: "Category added" })
  } catch (error: any) {
    handleServerError(res, error.message)
  }
}

const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = req.body
    delete category.id
    const id = req.params.id

    await prisma.category.update({
      where: { id },
      data: category
    })

    res.json({ success: true, message: "Category updated" })
  } catch (error: any) {
    handleServerError(res, error.message)
  }
}

const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id

    await prisma.category.delete({
      where: { id }
    })

    res.json({ success: true, message: "Category deleted" })
  } catch (error: any) {
    handleServerError(res, error.message)
  }
}

export default {
  addCategory,
  getAllCategories,
  deleteCategory,
  updateCategory,
  fillCategories
}
