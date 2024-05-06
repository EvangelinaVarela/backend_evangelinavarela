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
//         //valido que exista el carrito
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
           const result= await (cartManager.addCarts(cid,pid));
           return res.status(200).send({ status: 'success', payload:(`El producto ID ${pid} fue agregado al carrito Id ${cid}`) })
     }catch (error){
        return res.status(500).send('Error 500 en el server')
        console.log (error)
     }
   })

export default router