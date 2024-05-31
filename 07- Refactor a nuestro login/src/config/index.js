
import { connect } from 'mongoose';

export const connectDB = () => {

    connect('mongodb+srv://evangelinavarela:evangelina1234@cluster0.l5uohuv.mongodb.net/ecommerce');
    //connect('mongodb://127.0.0.1:27017/ecommerce');
    console.log('Base de datos conectada');
};