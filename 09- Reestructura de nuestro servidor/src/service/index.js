import productManagerMongoose from "../daos/productManagerMongoose.js";
import cartManagerMongoose from "../daos/cartsManagerMongoose.js";

export const productService= new productManagerMongoose()
export const  cartService= new cartManagerMongoose()

