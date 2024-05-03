import express from "express";
import authMiddleware from "../middleware/auth.middleware";
import transactionController from "../controllers/transaction.controller"

const router = express.Router()

router.get("/", authMiddleware, transactionController.getAllTransactions)
router.post("/fill", authMiddleware, transactionController.fillTransactions)
router.post("/", authMiddleware, transactionController.addTransaction)
router.put("/:id", authMiddleware, transactionController.updateTransaction)
router.delete("/:id", authMiddleware, transactionController.deleteTransaction)

export default router
