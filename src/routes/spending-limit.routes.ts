import express from "express";
import authMiddleware from "../middleware/auth.middleware";
import spendingLimitController from "../controllers/spending-limit.controller"

const router = express.Router()

router.get("/", authMiddleware, spendingLimitController.getAllSpendingLimits)
router.post("/fill", authMiddleware, spendingLimitController.fillSpendingLimits)
router.post("/", authMiddleware, spendingLimitController.addSpendingLimit)
router.put("/", authMiddleware, spendingLimitController.upsertSpendingLimit)

export default router
