import { Schema, model } from 'mongoose';
//import Product from '../models/products.model.js';

const cartsSchema = new Schema({
    products: [{
        product: {
          type: Schema.Types.ObjectId,
          ref: 'products'
        },
        quantity: {
            type: Number,
            default:0
        }
      }]
})

const cartsModel = model('carts', cartsSchema)

export default cartsModel;