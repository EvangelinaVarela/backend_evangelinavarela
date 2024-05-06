import cartsModel from '../models/carts.model.js';

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

    getCartsById = async (idCarrito) => { 
        try {
            const cart = await cartsModel.findById({_id: idCarrito})
            console.log (cart)
            return cart;    
           } catch (error) {
               console.log(error.message)
           }
       }

      addCarts = async(idCarrito, nuevoProducto) =>
         {
            const carrito = await cartsModel.findOne({ _id: idCarrito, 'products.product': nuevoProducto });
            if (carrito)
               {
                    const productoEncontrado = carrito.products.find(producto => producto.product.toString() === nuevoProducto);
                   
                    if (productoEncontrado)
                    {
                        const result = await cartsModel.findOneAndUpdate(
                                          { _id: idCarrito },
                                          { $set: { products: { product: nuevoProducto, quantity:productoEncontrado.quantity + 1  } } } )
                        console.log (result)  
                        return result                   
                    }
               } 
            else
               {
                    const result = await cartsModel.findOneAndUpdate(
                        { _id: idCarrito },
                        { $push: { products: { product: nuevoProducto, quantity: 1 } } } )
                    console.log (result)  
                    return result       
               }
         }
}

export default cartsManagerMongoose;