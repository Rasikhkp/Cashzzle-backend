"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const transaction_controller_1 = __importDefault(require("../controllers/transaction.controller"));
const router = express_1.default.Router();
router.get("/", auth_middleware_1.default, transaction_controller_1.default.getAllTransactions);
router.post("/fill", auth_middleware_1.default, transaction_controller_1.default.fillTransactions);
router.post("/", auth_middleware_1.default, transaction_controller_1.default.addTransaction);
router.put("/:id", auth_middleware_1.default, transaction_controller_1.default.updateTransaction);
router.delete("/:id", auth_middleware_1.default, transaction_controller_1.default.deleteTransaction);
exports.default = router;
