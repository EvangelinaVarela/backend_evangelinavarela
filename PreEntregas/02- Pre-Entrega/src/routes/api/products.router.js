
import { Router }  from 'express'

import productManagerMongoose from '../../daos/productManagerMongoose.js'

const productManager = new productManagerMongoose();

const router = Router()



//Trae todos
router.get('/', async  (req, res)=>{
    try
    {
    let { limit , nropage , status, sort, category} = req.query
    
    if (typeof limit === "undefined") {
      limit = 10;
      console.log('limit', limit);
   }

   if (typeof nropage === "undefined") {
      nropage = 1;
      console.log('nropage', nropage);
   }

   if (typeof sort === "undefined") {
      sort = 1;
   }

   // if (typeof status === "undefined") {
   //    status = true;
   // }

   //page, query (x categoria o por disponibilidad si Stcok>0), order by precio desc/asc
   const products = await productManager.getProducts(limit, nropage,sort, status,category)
   return res.status(200).send({status: 'success', payload: products})
    }
    catch (error){
        return res.status(500).send('Error 500 en el server')
        console.log (error)
    }
})

//Busca por id
router.get('/:pid', async (req, res)=>{
    try
    {
    const { pid } = req.params
    const producto = await productManager.getProductById(pid)
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

//Hace insert en BD
router.post('/', async(req, res) => {
    try
    {
    const { title, description,price, thumbnail,code,stock,status, category} = req.body
    const { body } = req

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

   const result = await productManager.addProduct(body)
   console.log (result)
   return res.status(200).send({ status: 'success', payload:('El producto fue ingresado corectamente') })
}catch (error){
   return res.status(500).send('Error 500 en el server')
   console.log (error)
}
})

//modificar
router.put('/:pid', async(req, res) => {
    try
    {
    const { pid } = req.params
    const  prodToUpdate = req.body
   
    const producto = await productManager.getProductById(pid)
   // console.log ('Producto a actualizar ',producto)
    if (!producto)
    {
        return res.status(404).send(`No existe el producto con ID ${pid}`);
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
    
    const result = await productManager.updateProduct( pid,prodToUpdate)
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
    console.log (pid)
    const result = await productManager.deleteProduct(pid)
    console.log (result)
   if (result.deletedCount===1) 
   {
    return res.status(200).send({ status: 'success', payload:(`El producto con ID ${pid} fue eliminado corectamente`) })
   }
   else
   {
    return res.status(404).send({status: 'error', error: `No se pudo borrar el Producto ID ${pid}`})
   }
  
}catch (error){
   console.log (error)
   return res.status(500).send('Error 500 en el server')
}
})

export default router