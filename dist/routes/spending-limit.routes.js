"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const spending_limit_controller_1 = __importDefault(require("../controllers/spending-limit.controller"));
const router = express_1.default.Router();
router.get("/", auth_middleware_1.default, spending_limit_controller_1.default.getAllSpendingLimits);
router.post("/fill", auth_middleware_1.default, spending_limit_controller_1.default.fillSpendingLimits);
router.post("/", auth_middleware_1.default, spending_limit_controller_1.default.addSpendingLimit);
router.put("/", auth_middleware_1.default, spending_limit_controller_1.default.upsertSpendingLimit);
exports.default = router;
