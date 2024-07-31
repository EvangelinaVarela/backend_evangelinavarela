import { Router }  from 'express'
import jwt from 'jsonwebtoken'
import { productService , userService} from '../service/index.js'

import productManagerMongoose from '../daos/mongo/productManagerMongoose.js'
import cartsManagerMongoose from '../daos/mongo/cartsManagerMongoose.js'

import { auth } from '../middlewares/auth.middleware.js';

import { passportCall } from '../middlewares/passportCall.middleware.js'
import { authorization } from "../middlewares/authorization.middleware.js";
import { compareSync } from 'bcrypt';
import { configObject } from '../config/config.js';
import { PRIVATE_KEY } from '../utils/jwt.js';
import { logger } from '../utils/logger.js'

const productManager = new productManagerMongoose();
const cartsManager = new cartsManagerMongoose();

const router = Router()

router.get('/products',passportCall('jwt'), async (req, res)=>{
    let { limit , nropage , disponibilidad, sort } = req.query

    if (typeof limit === "undefined") { limit = 10;  }
    if (typeof nropage === "undefined") {nropage = 1;}
    if (typeof sort === "undefined") { sort = 1; }

    const  { docs, page, hasPrevPage, hasNextPage, prevPage, nextPage } = await (productManager.getProducts(limit,nropage, sort));
       
    const usuario = req.user.user
    
    const nombre= usuario.first_name 
  
    let esAdmin
    if (usuario.role== 'admin' || usuario.role== 'premium') {
        esAdmin=true
    }
    else
        esAdmin=false

    res.render('home', {productos:docs,
        page, 
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage, nombre, role:esAdmin, cart: usuario.cart})
})
//role:req.session?.user?.admin 
router.get('/', async (req, res)=>{
    res.render('login',{} )
})

router.get('/register', async (req, res)=>{
    res.render('register',{} )
})

router.get('/forgotPassword', async (req, res)=>{
    res.render('forgotPassword',{} )
})

router.get('/resetPass/:token', async (req, res)=>{
    try {
        const {token} = req.params

        const decodedUser = jwt.verify(token, PRIVATE_KEY)
        logger.info ('decodedUser', decodedUser)
        
        if (!decodedUser) return res.status(400).send({status: 'error', message: 'El token no es válido o ha expirado'})

        res.render('resetPass',{token})
    } catch (error) {
        if (error.name === 'TokenExpiredError'){
            logger.error('Token Expirado')
            res.render('forgotPassword',{} )
        }
        else{
            logger.error('Reserpass', error)
            res.status(401).send({status: 'error', message: 'El token no es válido'})
        }
        
    }
})

 router.get('/carts/:cid',passportCall('jwt'), async (req, res)=>{
      const { cid } = req.params
      const carrito= await (cartsManager.getCart(cid));
      const productos = carrito.products
      res.render('carts', {productos})
 })


 router.get('/adminproducts',passportCall('jwt'), async (req, res)=>{
    const productos= await (productManager.getProducts(10,1,1));
    res.render('adminProductos', {productos:productos.docs})
})
//authorization('user')
 router.post('/products', passportCall('jwt'),authorization('user','premium'),async (req, res) => {
    const {prodId , txtCantidad , CartId} = req.body
    
    const usuario = req.user.user
    if (usuario.role==='premium') 
    {
        const owner = await userService.getUser({email:usuario.email})
        const producto = await  productService.getProduct(prodId)
        if (String(owner._id) == String(producto.owner._id)){
            return res.status(404).send({ status: 'error', payload:(`No puede agregar un producto propio al carrito`) })
        } 
    }
  
    const cart = await cartsManager.getCart(CartId)
    const result= await (cartsManager.addCart(CartId,prodId,txtCantidad));
    res.redirect('/carts/'+ CartId)
}); 
//authorization('admin')
router.get('/realtimeproducts', passportCall('jwt'), async(req, res)=>{
    const { socketServer } = req

    socketServer.on('connection', async (socket) => {
         //eliminar producto 
        // socket.on('eliminarProducto', async data=>{
        //     const { id } = data
        //     console.log ('socket delete', id)
        //     await productManager.deleteProduct(id)
        //  })      

       //Enviar productos a todos los clientes
        const productos= await (productManager.getProducts(10,1,1));
        socket.emit("cargarProductos",  productos.docs);
    });
    const nombre= ''
     res.render('realtimeproducts', { 
        nombre
     })
   
})
export default router