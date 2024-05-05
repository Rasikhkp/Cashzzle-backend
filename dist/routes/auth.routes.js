"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const router = express_1.default.Router();
router.post('/register', auth_controller_1.default.registerUser);
router.post('/login', auth_controller_1.default.loginUser);
router.get('/logout', auth_controller_1.default.logoutUser);
router.post('/verify-email', auth_controller_1.default.verifyEmail);
router.post('/forget-password', auth_controller_1.default.forgetPassword);
router.post('/new-password', auth_controller_1.default.resetPassword);
router.get('/refresh-token', auth_controller_1.default.refreshToken);
exports.default = router;
