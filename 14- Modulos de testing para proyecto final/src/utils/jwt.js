import jwt from 'jsonwebtoken'
import { configObject } from '../config/config.js'
import { compareSync } from 'bcrypt'

const {jwt_private_key} = configObject

export const PRIVATE_KEY = jwt_private_key

export const generateToken = user => jwt.sign(user, PRIVATE_KEY, {expiresIn: '24h'})

// const generateToken = ({user={}, expiresIn='24'}) => {
//     // logger.info(user)
//     const token = jwt.sign(user, PRIVATE_KEY, {expiresIn})
//     return token
// }

export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, PRIVATE_KEY);
        return { valid: true, decoded };
    } catch (err) {
        return { valid: false, message: err.message };
    }
};