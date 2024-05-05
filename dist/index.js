"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("./config/passport.config");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const transaction_routes_1 = __importDefault(require("./routes/transaction.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const spending_limit_routes_1 = __importDefault(require("./routes/spending-limit.routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 1234;
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: 'http://localhost:3000', credentials: true }));
app.use((0, cookie_parser_1.default)());
app.use('/api/users', user_routes_1.default);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/transactions', transaction_routes_1.default);
app.use('/api/categories', category_routes_1.default);
app.use('/api/spendingLimits', spending_limit_routes_1.default);
app.get("/tes", (req, res) => {
    res.send("tes");
});
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
