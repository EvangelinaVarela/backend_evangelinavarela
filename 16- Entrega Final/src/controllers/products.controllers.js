
import { productService , userService} from '../service/index.js'
import CustomError from '../service/errors/CustomError.js'
import EErrors from '../service/errors/enums.js'

import {generateProductError} from '../service/errors/info.js'
import { logger } from '../utils/logger.js'
import {sendEmail} from '../utils/sendEmail.js'

import { configObject } from '../config/config.js'

const {user_admin} = configObject


export default class  ProductCotroller
{
    constructor(){
     }

    getProducts =  async  (req, res)=>{
        try
        {
        let { limit , nropage , status, sort, category} = req.query
        
        if (typeof limit === "undefined") {
          limit = 10;
       }
    
       if (typeof nropage === "undefined") {
          nropage = 1;
       }
    
       if (typeof sort === "undefined") {
          sort = 1;
       }
       const products = await  productService.getProducts(limit, nropage,sort, status,category) //
       return res.status(200).send({status: 'success', payload: products})
        }
        catch (error){
            logger.error(error)
            return res.status(500).send('Error 500 en el server')
        }
    }

    getProduct= async (req, res)=>{
        try
        {
            const { pid } = req.params
            const producto = await  productService.getProduct(pid)
            if (!producto)
            {
                return res.status(404).send(`No existe el producto con ID ${pid}`);
            }
            return res.status(200).send({ status: 'success', payload: producto })
        }catch (error){
            return res.status(500).send('Error 500 en el server')
            logger.error(error)
        }
    }

    createProduct= async(req, res) => {
    try
        {
        const { title, description,price, thumbnail,code,stock,status, category} = req.body
        const { body } = req

        if (!title || !description || !price || !code || !stock || !category)
        {
            CustomError.createError({
                name: "Producto creacion error",
                cause: generateProductError({title,description ,price,category,stock,code}),
                message: "Error de Tipo de datos en Crear Producto",
                code:EErrors.INVALID_TYPES_ERROR
            })
        }

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
      
       const usuario = req.user.user
      
        let owner = usuario
        if (usuario.role==='premium') 
        {
           owner = await userService.getUser({email:usuario.email})
        }
        else{
           owner = await userService.getUser({email:user_admin})
        }

        const newProduct={
            title,
            description,
            price,
            thumbnail: 'Sin Imagen',
            code,stock,
            status:1, category,owner
        }
    
   const result = await  productService.addProduct(newProduct)
   return res.status(200).send({ status: 'success', payload:('El producto fue ingresado corectamente') })
    }catch (error){
        logger.error(error)
        return res.status(500).send('Error 500 en el server')
    }
    }

    updateProduct= async(req, res) => {
        try
        {
        const { pid } = req.params
        let  prodToUpdate = req.body
         
        const producto = await  productService.getProduct(pid)
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
         
         let owner =  await userService.getUser({email:user_admin})
       //  prodToUpdate.owner= owner
        
        const result = await productService.updateProduct(pid,prodToUpdate)
        return res.status(200).send({ status: 'success', payload:(`El producto con ID ${pid} fue modificado corectamente`) })
    }catch (error){
        logger.error(error)
        return res.status(500).send('Error 500 en el server')
      }
    }

    deleteProduct=  async(req, res) => {
        try
        {
         const { pid } = req.params
         const producto = await  productService.getProduct(pid)
       
         if (!producto)
         {  
            return res.status(404).send(`No existe el producto con ID ${pid}`);
         }
        
         const usuario = req.user.user
         let owner =usuario
         //si es premiiun solo puede borrar un producto suyo
         if (usuario.role==='premium') 
         {
            owner = await userService.getUser({email:usuario.email})
            if (!producto.owner || !producto.owner._id)
            {
                logger.info ('El producto no tiene propietario')
            } 
            else
            {
                if (String(owner._id) !== String(producto.owner._id)){
                    return res.status(404).send({ status: 'error', payload:(`No se puede borrar el producto porque no le pertenece`) })
                }
            }
         }
      
        const result = await  productService.deleteProduct(pid)

        if (result.deletedCount===1) 
        {
            //si producto eliminado era de un usuario es premiun enviar mail
            if (producto.owner.role==='premium')  
            {
                console.log ('Role',producto.owner.role)
                const subject = 'Se elimino un producto de la tienda'
                const html = `
                <p> Hola ${producto.owner.firts_name}, </p>
                <p> Le informamos que el producto ${producto.title} ha sido eliminado de la tienda</p>  `
                await sendEmail({mail:  producto.owner.email,
                    subject,
                    html
                })
            }    

            return res.status(200).send({ status: 'success', payload:(`El producto con ID ${pid} fue eliminado corectamente`) })
        }
        else
        {
            return res.status(404).send({status: 'error', error: `No se pudo borrar el Producto ID ${pid}`})
        }
       
     }catch (error){
        logger.error(error)
        return res.status(500).send('Error 500 en el server')
     }
    }
}