import express from "express";
import authMiddleware from "../middleware/auth.middleware";
import categoryController from "../controllers/category.controller"

const router = express.Router()

router.get("/", authMiddleware, categoryController.getAllCategories)
router.post("/fill", authMiddleware, categoryController.fillCategories)
router.post("/", authMiddleware, categoryController.addCategory)
router.put("/:id", authMiddleware, categoryController.updateCategory)
router.delete("/:id", authMiddleware, categoryController.deleteCategory)

export default router
