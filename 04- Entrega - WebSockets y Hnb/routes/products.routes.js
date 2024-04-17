import { Router } from 'express'
import ProductManager from '../src/ProductManager.js'

const productManager= new ProductManager("./productos.json");

const router = Router()

router.get('/', async  (req, res)=>{
    try
    {
    const { limit } = req.query
  
    const productos= await (productManager.getProducts());
     if (!limit)
     {
       return res.status(200).send({status: 'success', payload: productos})
     }
     else
     {
        const productosLimit = productos.slice(0, parseInt(limit));
        return res.status(200).send({ status: 'success', payload: productosLimit })
     }
    }
    catch (error){
        return res.status(500).send('Error 500 en el server')
        console.log (error)
    }
})

router.get('/:pid', async (req, res)=>{
    try
    {
    const { pid } = req.params
    const producto= await (productManager.getProductById(parseInt(pid)));
    if (!producto)
    {
        return res.status(404).send(`No existe el producto con ID ${pid}`);
    }
    return res.status(200).send({ status: 'success', payload: producto })
}catch (error){
   return res.status(500).send('Error 500 en el server')
   console.log (error)
}
})

router.post('/', async(req, res) => {
    try
    {
    const { title, description,price, thumbnail,code,stock,status, category} = req.body

    console.log (title, description,price, thumbnail,code,stock,status, category)

    if(title.trim().length === 0) {
        return res.status(404).send({status: 'error', error: 'Debe ingresar un valor para Title'})
     }

     if(description.trim().length === 0) {
        return res.status(404).send({status: 'error', error: 'Debe ingresar un valor para Description'})
     }

     if(price === 0) {
        return res.status(404).send({status: 'error', error: 'Debe ingresar un valor para price'})
     }

     if(category.trim().length === 0) {
        return res.status(404).send({status: 'error', error: 'Debe ingresar un valor para category'})
     }

     if(code.length === 0) {
        return res.status(404).send({status: 'error', error: 'Debe ingresar un valor para Code'})
     }

     if(stock === 0) {
        return  res.status(404).send({status: 'error', error: 'Debe ingresar un valor para Stock'})
     }

    productManager.addProduct(title, description,price, thumbnail,code,stock,status, category)
    
    return res.status(200).send({ status: 'success', payload:('El producto fue ingresado corectamente') })
}catch (error){
   return res.status(500).send('Error 500 en el server')
   console.log (error)
}
})


router.put('/:pid', async(req, res) => {
    try
    {
    const { pid } = req.params
    const  prodToUpdate   = req.body

    const producto = await productManager.getProductById(parseInt(pid))
    if (!producto)
    {
        return res.status(404).send({status: 'error', error: `El producto con ID ${pid} no existe`})
    }
    
    if(prodToUpdate.title.trim().length === 0) {
        return res.status(404).send({status: 'error', error: 'Debe ingresar un valor para Title'})
     }

     if(prodToUpdate.description.trim().length === 0) {
        return res.status(404).send({status: 'error', error: 'Debe ingresar un valor para Description'})
     }

     if(prodToUpdate.price === 0) {
        return res.status(404).send({status: 'error', error: 'Debe ingresar un valor para price'})
     }

     if(prodToUpdate.category.trim().length === 0) {
        return res.status(404).send({status: 'error', error: 'Debe ingresar un valor para category'})
     }

     if(prodToUpdate.code.length === 0) {
        return res.status(404).send({status: 'error', error: 'Debe ingresar un valor para Code'})
     }

     if(prodToUpdate.stock === 0) {
        return  res.status(404).send({status: 'error', error: 'Debe ingresar un valor para Stock'})
     }
    prodToUpdate.id=parseInt(pid)
    productManager.updateProduct(prodToUpdate)
   
    return res.status(200).send({ status: 'success', payload:(`El producto con ID ${pid} fue modificado corectamente`) })
}catch (error){
   return res.status(500).send('Error 500 en el server')
   console.log (error)
}
})

router.delete('/:pid', async(req, res) => {
   try
   {
   const { pid } = req.params

   const producto = await productManager.getProductById(parseInt(pid))
   if (!producto)
   {
       return res.status(404).send({status: 'error', error: `El producto con ID ${pid} no existe`})
   }

   productManager.deleteProduct(parseInt(pid))
   return res.status(200).send({ status: 'success', payload:(`El producto con ID ${pid} fue eliminado corectamente`) })
}catch (error){
   return res.status(500).send('Error 500 en el server')
   console.log (error)
}
})


export default router