import express from 'express'
import authMiddleware from '../middleware/auth.middleware'
import userController from '../controllers/user.controller'

const router = express.Router()

router.get("/", authMiddleware, userController.getAllUsers)
router.get("/authenticated-user", authMiddleware, userController.getAuthenticatedUser)

export default router
