import cartsModel from '../daos/models/carts.model.js';

class cartsManagerMongoose
{
    constructor()
    {        
    }

    createCart = async()=>
    {
        try
        {   
            const cart= {
                products: []
        } ;
            const result = await cartsModel.create(cart)
            return (result)
        }catch (error)
        {
            console.log(error.message)
        }
    }

    getCartsById = async (idCarrito) => 
    { 
        try {
            console.log ('Carrito', idCarrito)
            const cart = await cartsModel.findById({_id: idCarrito}).populate('products.product').lean()
            console.log (cart)
            return cart;    
           } catch (error) {
               console.log(error.message)   
           }
    }

    deleteProcuct = async(idCarrito, pid) =>
    {
        try {

            const cart = await cartsModel.findOne({ _id: idCarrito, 'products.product': pid });
            if (cart)
            {
                
                 //console.log ('Carrito:', cart)
                 const result = await cartsModel.updateOne(
                    { _id: idCarrito },
                    { $pull: { products: { product: pid } } },
                    { new: true } // Return the updated cart
                );
                console.log ('Delete produc de carrito',result)  
            }    
        }
        catch (error) {
            console.log(error.message)
        }
    }

    deleteAllProcuct = async(idCarrito) =>
        {
            try {
    
                const cart = await cartsModel.findOne({ _id: idCarrito});
                if (cart)
                {
                     console.log ('Carrito a Vaciar:', cart)
                    //  const result = await cartsModel.updateOne(
                    //     { _id: idCarrito },
                    //     { $pull: { products: { product: pid } } },
                    //     { new: true } // Return the updated cart                   );
                    const result =  await cartsModel.updateMany({ _id: idCarrito}, { $set: { products: [] } })
                    console.log ('Vaciar de carrito',result)  
                }    
            }
            catch (error) {
                console.log(error.message)
            }
        }

    addCarts = async(idCarrito, nuevoProducto, quantity) =>
        {
           const carrito = await cartsModel.findOne({ _id: idCarrito, 'products.product': nuevoProducto });
                     
           if (carrito)
            {
                 const result = await cartsModel.updateOne(
                    { _id: idCarrito },
                    { $set: { products: { product: nuevoProducto, quantity:quantity  } } } )           
                console.log ('UPDATE produc de carrito',result)  
                return result     
            }    
          else
              {
                   const result = await cartsModel.findOneAndUpdate(
                       { _id: idCarrito },
                       { $push: { products: { product: nuevoProducto, quantity: quantity } } } )
                   console.log ('Nuevo produc de carrito', result)  
                   return result       
              }
        }

    addAllProcuct = async(idCarrito, carrito) =>
    {
        try {
            const result = await cartsModel.findByIdAndUpdate({_id: idCarrito},carrito)
            console.log ('addAllProcuct',result)  
            return result
        }
        catch (error) {
            console.log(error.message)
        }
    }

    UpdateProduct = async(idCarrito, carrito) =>
    {
        try {
            const result = await cartsModel.findByIdAndUpdate({_id: idCarrito},carrito)
            console.log ('UpdateProduct',result)  
            return result
        }
        catch (error) {
            console.log(error.message)
        }
    }
}

export default cartsManagerMongoose;