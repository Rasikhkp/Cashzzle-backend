import passport from 'passport'
import { prisma } from '../utils/prisma'
import { Strategy as GoogleStrategy, Profile, StrategyOptionsWithRequest, VerifyCallback } from 'passport-google-oauth20'
import { Strategy as JWTStrategy, VerifiedCallback } from 'passport-jwt'
import { User } from '@prisma/client'
import { Request } from 'express'

const optGoogle: StrategyOptionsWithRequest = {
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: '/auth/google/callback',
  passReqToCallback: true
}

const optJWT = {
  jwtFromRequest: (req: Request) => {
    return req && req.cookies ? req.cookies['access-token'] : null
  },
  secretOrKey: process.env.JWT_SECRET!,
  ignoreExpiration: true
}

const verifyGoogle = async (_: any, __: any, ___: any, profile: Profile, done: VerifyCallback) => {
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
}

const verifyJWT = async (jwtPayload: User, done: VerifiedCallback) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: jwtPayload.id }
    })

    if (!user) {
      return done(null, false, { message: "User not found" })
    }

    return done(null, user)
  } catch (error) {
    return done(error, false)
  }
}

passport.use(new JWTStrategy(optJWT, verifyJWT))
passport.use(new GoogleStrategy(optGoogle, verifyGoogle))
