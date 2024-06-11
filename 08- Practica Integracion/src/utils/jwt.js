import jwt from 'jsonwebtoken'

export const PRIVATE_KEY = 'CoderKeyS@cretToken'

export const generateToken = user => jwt.sign(user, PRIVATE_KEY, {expiresIn: '24h'})

