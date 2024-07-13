import { Router }  from 'express'

import productManagerMongoose from '../daos/mongo/productManagerMongoose.js'
import cartsManagerMongoose from '../daos/mongo/cartsManagerMongoose.js'

import { auth } from '../middlewares/auth.middleware.js';

import { passportCall } from '../middlewares/passportCall.middleware.js'
import { authorization } from "../middlewares/authorization.middleware.js";
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
    if (usuario.role== 'admin') {
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

 router.get('/carts/:cid', async (req, res)=>{
      const { cid } = req.params
      const carrito= await (cartsManager.getCart(cid));
      const productos = carrito.products
      res.render('carts', {productos})
 })

 router.post('/products', passportCall('jwt'),authorization('user'),async (req, res) => {
    const {prodId , txtCantidad , CartId} = req.body
    
    const cart = await cartsManager.getCart(CartId)

    const result= await (cartsManager.addCart(CartId,prodId,txtCantidad));
    res.redirect('/carts/'+ CartId)
}); 

router.get('/realtimeproducts', passportCall('jwt'),authorization('admin'), async(req, res)=>{
    const { socketServer } = req
  
     socketServer.on('connection', async (socket) => {
        // console.log('Un cliente se ha conectado');
    // //     //agrega producto nuevo
        // socket.on('agregarProducto', async data=>{
        //     //title, description,price, thumbnail,code,stock,status, category
        //     const { title, description,price, thumbnail,code,stock,status, category} = data
            
        //     const newProduct={
        //         title,
        //         description,
        //         price,
        //         thumbnail,
        //         code,stock,status, category
        //     }
        //     console.log ('Nuevo producto',newProduct)
        //     //await productManager.addProduct (title, description,price, thumbnail,code,stock,status, category)
        //     await productManager.addProduct (newProduct)
        //  })      
         
        //eliminar producto 
        socket.on('eliminarProducto', async data=>{
            const { id } = data
            console.log ('socket', id)
            await productManager.deleteProduct(id)
         })      

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