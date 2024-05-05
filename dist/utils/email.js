"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetPasswordEmail = exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
let transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: 'rasikhonly@gmail.com', // Your email address
        pass: 'uccz cyuw cvtj orui' // Your email password
    }
});
const sendVerificationEmail = (name, to, token) => {
    let mailOptions = {
        from: 'rasikhonly@gmail.com',
        to,
        subject: 'Email Verification',
        html: `<div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        
        <h2>Email Verification</h2>
        
        <p>Dear ${name},</p>
        
        <p>Thank you for signing up. Please click the button below to verify your email address:</p>
        
        <a href="http://localhost:3000/verify-email?token=${token}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Verify Email Address</a>
        
        <p>If you did not create an account, you can safely ignore this email.</p>
        
        <p>Best regards,<br>Your Website Team</p>
    
    </div>`
    };
    // Sending email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred:');
            console.log(error.message);
        }
        else {
            console.log('Message ID: ' + info.messageId);
            console.log('Preview URL: ' + nodemailer_1.default.getTestMessageUrl(info));
        }
    });
};
exports.sendVerificationEmail = sendVerificationEmail;
const sendResetPasswordEmail = (to, token) => {
    let mailOptions = {
        from: 'rasikhonly@gmail.com',
        to,
        subject: 'Reset Password',
        html: `<div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        
        <h2>Reset Password</h2>
        
        <p>Dear User,</p>
        
        <p>We received a request to reset your password. Please click the button below to proceed:</p>

        <a href="http://localhost:3000/reset-password?token=${token}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
        
        <p>If you did not request this password reset, you can ignore this email.</p>
        
        <p>Best regards,<br>Your Website Team</p>
    
    </div>`
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred:');
            console.log(error.message);
        }
        else {
            console.log('Message ID: ' + info.messageId);
            console.log('Preview URL: ' + nodemailer_1.default.getTestMessageUrl(info));
        }
    });
};
exports.sendResetPasswordEmail = sendResetPasswordEmail;
