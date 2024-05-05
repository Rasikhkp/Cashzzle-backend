"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const prisma_1 = require("../utils/prisma");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_jwt_1 = require("passport-jwt");
const optGoogle = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    passReqToCallback: true
};
const optJWT = {
    jwtFromRequest: (req) => {
        return req && req.cookies ? req.cookies['access-token'] : null;
    },
    secretOrKey: process.env.JWT_SECRET,
    ignoreExpiration: true
};
const verifyGoogle = async (_, __, ___, profile, done) => {
    try {
        let user = await prisma_1.prisma.user.findUnique({
            where: { email: profile.emails[0].value }
        });
        if (!user) {
            user = await prisma_1.prisma.user.create({
                data: {
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    picture: profile.photos[0].value
                }
            });
        }
        return done(null, user);
    }
    catch (error) {
        return done(error, false);
    }
};
const verifyJWT = async (jwtPayload, done) => {
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: jwtPayload.id }
        });
        if (!user) {
            return done(null, false, { message: "User not found" });
        }
        return done(null, user);
    }
    catch (error) {
        return done(error, false);
    }
};
passport_1.default.use(new passport_jwt_1.Strategy(optJWT, verifyJWT));
passport_1.default.use(new passport_google_oauth20_1.Strategy(optGoogle, verifyGoogle));
