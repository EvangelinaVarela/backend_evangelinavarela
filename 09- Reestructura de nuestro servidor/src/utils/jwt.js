import jwt from 'jsonwebtoken'
import { objetConfig } from '../config/index.js'

const {jwt_private_key} = objetConfig

export const PRIVATE_KEY = jwt_private_key

export const generateToken = user => jwt.sign(user, PRIVATE_KEY, {expiresIn: '24h'})

