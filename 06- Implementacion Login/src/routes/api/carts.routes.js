import { Router } from 'express'

import cartsManagerMongoose from '../../daos/cartsManagerMongoose.js'

import cartModel from '../../models/carts.model.js';
import productsModel from '../../models/products.model.js';

const cartManager = new cartsManagerMongoose();

const router = Router()

router.post('/', async(req, res) => {
try
{
    cartManager.createCart()
    return res.status(200).send({ status: 'success', payload:('El carrito fue creado corectamente') })
}catch (error){
   return res.status(500).send('Error 500 en el server')
   console.log (error)
}
})

router.get('/:cid', async (req, res)=>{
    try
    {
    const { cid } = req.params
    console.log (cid)
    const carrito= await (cartManager.getCartsById(cid));
    if (!carrito)
    {
        return res.status(404).send(`No existe el carrito con ID ${cid} `);
    }
    return res.status(200).send({ status: 'success', payload: carrito })
}catch (error){
   return res.status(500).send('Error 500 en el server')
   console.log (error)
}
})

 router.post('/:cid/product/:pid', async(req, res) => {
     try
     {
           const { cid , pid } = req.params
           let { quantity } = req.body
           console.log ('ADD Product')
             //valido que exista el carrito
           const carrito= await (cartManager.getCartsById(cid));
            if (!carrito)
            {
                return res.status(404).send(`No existe el carrito con ID ${cid} `);
            }

            const producto = await productsModel.findById({_id: pid})
            console.log (producto)
            if (!producto)
            {
                return res.status(404).send(`No existe el producto con ID ${pid}`);
            }

            if (typeof quantity === "undefined") {
                quantity = 1;
                console.log('cantidad', quantity);
             }

           const result= await (cartManager.addCarts(cid,pid, quantity));
           return res.status(200).send({ status: 'success', payload:(`El producto ID ${pid} fue agregado al carrito Id ${cid}`) })
     }catch (error){
        return res.status(500).send('Error 500 en el server')
        console.log (error)
     }
   })

   router.delete('/:cid/product/:pid', async(req, res) => {
    try
    {
        const { cid , pid } = req.params
        const carrito= await (cartManager.getCartsById(cid));
        if (!carrito)
        {
            return res.status(404).send(`No existe el carrito con ID ${cid} `);
        }

        const result= await cartManager.deleteProcuct(cid, pid)
        return res.status(200).send({ status: 'success', payload:(`El producto ID ${pid} fue eliminado del carrito Id ${cid}`) })
    }catch (error){
       return res.status(500).send('Error 500 en el server')
       console.log (error)
    }
    })

    router.delete('/:cid', async(req, res) => {
        try
        {
            const { cid } = req.params
            const carrito= await (cartManager.getCartsById(cid));
            if (!carrito)
            {
                return res.status(404).send(`No existe el carrito con ID ${cid} `);
            }
    
            const result= await cartManager.deleteAllProcuct(cid)
            return res.status(200).send({ status: 'success', payload:(`Se vacio todo el carrito Id ${cid}`) })
        }catch (error){
           return res.status(500).send('Error 500 en el server')
           console.log (error)
        }
        })

    router.put('/:cid',async (req, res)=>{

        const {cid} = req.params;
    
        const carrito= await (cartManager.getCartsById(cid));
        if (!carrito)
        {
            return res.status(404).send(`No existe el carrito con ID ${cid} `);
        }
    
        carrito.products = req.body;
        const result= await cartManager.addAllProcuct(cid, carrito)
        return res.status(200).send({ status: 'success', payload:(`Se agregaron todos los productos al carrito Id ${cid}`) })
            
    })

    router.put('/:cid/product/:pid',async (req, res)=>{
        //actualizo la cantidad a un prod.

        const {cid , pid} = req.params;
        console.log('actualizo la cantidad a un prod.')
        const carrito= await (cartManager.getCartsById(cid));
        if (!carrito)
        {
            return res.status(404).send(`No existe el carrito con ID ${cid} `);
        }
        const result= await (cartManager.addCarts(cid,pid,req.body.quantity));
        return res.status(200).send({ status: 'success', payload:(`Se actualizo la cantidad del producto en el carrito Id ${cid}`) })
        // const prodIndex = carrito.products.findIndex(prod=>prod.product == pid.toString);
        // console.log('Indice',prodIndex)
        // if(prodIndex < 0){
        //     return res.status(404).send(`Producto no encontrado en el carrito con ID ${cid} `);
        // }else{
        //      carrito.products[prodIndex].quantity = req.body.quantity;
        //      const result= await (cartManager.UpdateProduct(cid,carrito));
        //     return res.status(200).send({ status: 'success', payload:(`Se actualizo la cantidad del producto en el carrito Id ${cid}`) })
        // }   
           
    })

export default router