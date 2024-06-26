"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const router = express_1.default.Router();
router.get("/", auth_middleware_1.default, user_controller_1.default.getAllUsers);
router.get("/authenticated-user", auth_middleware_1.default, user_controller_1.default.getAuthenticatedUser);
exports.default = router;
