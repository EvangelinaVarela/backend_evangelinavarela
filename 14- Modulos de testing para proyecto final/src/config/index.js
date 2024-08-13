
import { connect } from 'mongoose';
import { compareSync } from 'bcrypt';
import { configObject } from './config.js';
import { logger } from '../utils/logger.js'

export const connectDB = () => {
    connect(configObject.MONGO_URL);
    logger.info('Base de datos conectada')
};