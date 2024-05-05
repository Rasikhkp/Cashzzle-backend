"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const category_controller_1 = __importDefault(require("../controllers/category.controller"));
const router = express_1.default.Router();
router.get("/", auth_middleware_1.default, category_controller_1.default.getAllCategories);
router.post("/fill", auth_middleware_1.default, category_controller_1.default.fillCategories);
router.post("/", auth_middleware_1.default, category_controller_1.default.addCategory);
router.put("/:id", auth_middleware_1.default, category_controller_1.default.updateCategory);
router.delete("/:id", auth_middleware_1.default, category_controller_1.default.deleteCategory);
exports.default = router;
