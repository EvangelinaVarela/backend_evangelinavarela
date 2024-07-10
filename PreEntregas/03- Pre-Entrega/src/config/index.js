
import { connect } from 'mongoose';
import { compareSync } from 'bcrypt';
import { configObject } from './config.js';

export const connectDB = () => {
    connect(configObject.MONGO_URL);
    console.log('Base de datos conectada');
};