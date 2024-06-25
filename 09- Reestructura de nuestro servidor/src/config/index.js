
import { connect } from 'mongoose';
import dotenv from 'dotenv'
import { compareSync } from 'bcrypt';

dotenv.config();
//console.log (process.env)

export const objetConfig={
    port: process.env.PORT || 8080, 
    mongoUrl: process.env.DATABASE_URL, 
    jwt_private_key: process.env.JWT_SECRET_KEY
}
export const connectDB = () => {
   //connect('mongodb+srv://evangelinavarela:evangelina1234@cluster0.l5uohuv.mongodb.net/ecommerce');
    connect(objetConfig.mongoUrl);
    //connect('mongodb://127.0.0.1:27017/ecommerce');
    console.log('Base de datos conectada');
};