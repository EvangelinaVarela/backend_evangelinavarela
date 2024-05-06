import productsModel from '../models/products.model.js';

class productManagerMongoose
{
    constructor()
    {        
    }

    addProduct = async(product)=>
    {
        try
        {
            const result = await productsModel.create(product)
            return (result)
        }catch (error)
        {
            console.log(error.message)
        }
    }

    deleteProduct = async (id) =>
    { 
        try
        {
            const result =  await productsModel.deleteOne({_id: id})
            console.log ('Resuldado delete', result)
            return result
        }catch (error)
        {
            console.log(error.message)
        }
    }

    updateProduct = async(pid, prodUpdate) =>
    {
        try
        {
            console.log ('entra put')
            const result =  await productsModel.updateOne({_id: pid},prodUpdate)
            console.log ('Resuldado update', result)
            return result
        }catch (error)
        {
            console.log(error.message)
        }
    }

    getProducts = async (limit)=>{
        try
        {
            if (!limit)
            {
                const products = await productsModel.find({})
                return (products)
            }
            else
            {
                const productsLimit = await productsModel.find().limit(limit)
                return (productsLimit)
            }
        }catch(error)
        {
            console.log(error.message)
        }
    }

    getProductById = async (idProducto) => { 
        try {
            const products = await productsModel.findById({_id: idProducto})
            return products;    
           } catch (error) {
               console.log(error.message)
           }
       }
}

export default productManagerMongoose;