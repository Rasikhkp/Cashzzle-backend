import passport from 'passport'
import { prisma } from '../prisma'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import jwt from 'jsonwebtoken';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await prisma.user.findUnique({
            where: { email: profile.emails![0].value }
        })

        if (!user) {
            user = await prisma.user.create({
                data: {
                    name: profile.displayName,
                    email: profile.emails![0].value,
                    picture: profile.photos![0].value
                }
            });
        }

        return done(null, user);
    } catch (error: any) {
        return done(error, false);
    }
}));

