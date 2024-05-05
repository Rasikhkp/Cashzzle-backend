"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleServerError = void 0;
const handleServerError = (res, message = 'Internal Server Error', status = 500) => {
    console.error('Error:', message);
    res.status(status).json({ success: false, message });
};
exports.handleServerError = handleServerError;
