import passport from 'passport'
import { Strategy as JWTStrategy, VerifiedCallback } from 'passport-jwt'
import { prisma } from '../prisma'
import { User } from '@prisma/client'
import { Request } from 'express'

const cookieExtractor = (req: Request) => {
    return req && req.cookies ? req.cookies['access-token'] : null
}

const opt = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET!
}

const verify = async (jwtPayload: User, done: VerifiedCallback) => {
    try {
        console.log('payload', jwtPayload)
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

passport.use(new JWTStrategy(opt, verify))
