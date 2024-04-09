import { Router } from 'express'

import CartsManager from '../src/CartsManager.js'
const cartsManager= new CartsManager("./carts.json");

import ProductManager from '../src/ProductManager.js'
const productManager= new ProductManager("./productos.json");

const router = Router()

router.post('/', async(req, res) => {
try
{
    cartsManager.createCart()
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
    const carrito= await (cartsManager.getCartsById(parseInt(cid)));
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
        
        //valido que exista el carrito
        const carrito= await (cartsManager.getCartsById(parseInt(cid)));
        if (!carrito)
        {
            return res.status(404).send(`No existe el carrito con ID ${cid} `);
        }

        //valido que exista el producto que quiero agregar
        const producto= await (productManager.getProductById(parseInt(pid)));
        if (!producto)
        {
            return res.status(404).send(`No existe el producto con ID ${pid} `);
        }

        cartsManager.addCarts(parseInt(cid), { id: parseInt(pid), quantity: 1 } )

        return res.status(200).send({ status: 'success', payload:(`El producto ID ${pid} fue agregado al carrito Id ${cid}`) })
    }catch (error){
       return res.status(500).send('Error 500 en el server')
       console.log (error)
    }
    })

export default router