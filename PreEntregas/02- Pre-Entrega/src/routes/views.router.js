import { Router }  from 'express'

import productManagerMongoose from '../daos/productManagerMongoose.js'

import cartsManagerMongoose from '../daos/cartsManagerMongoose.js'

const productManager = new productManagerMongoose();
const cartsManager = new cartsManagerMongoose();

const router = Router()

router.get('/products', async (req, res)=>{
    let { limit , nropage , disponibilidad, sort } = req.query

    if (typeof limit === "undefined") {
      limit = 10;
   }

   if (typeof nropage === "undefined") {
      nropage = 1;
   }
    if (typeof sort === "undefined") {
        sort = 1;
    }

    const  { docs, page, hasPrevPage, hasNextPage, prevPage, nextPage } = await (productManager.getProducts(limit,nropage, sort));

    res.render('home', {productos:docs,
        page, 
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage
    })
})

 router.get('/carts/:cid', async (req, res)=>{
      const { cid } = req.params
      const carrito= await (cartsManager.getCartsById(cid));
      const productos = carrito.products
      //console.log ('Ver carrirto', productos)
      res.render('carts', {productos})
 })

 router.post('/products', async (req, res) => {
    const {prodId , txtCantidad , carId} = req.body

    console.log ('Post producto',prodId , txtCantidad , carId)
    const cart = await cartsManager.getCartsById(carId)

    //  if (!cart)
    //  {
    //    //return res.status(404).send(`No existe el carrito con ID ${cid} `);
    //    const mensaje= "No existe el carrito ingresado"
    //    res.render('mensaje', mensaje)
    //  }

    const result= await (cartsManager.addCarts(carId,prodId,txtCantidad));
    res.redirect('/carts/'+ carId)
    
    
}); 

router.get('/realtimeproducts',  async(req, res)=>{
    const { socketServer } = req

    socketServer.on('connection', async (socket) => {
        console.log('Un cliente se ha conectado');
        
    //     //agrega producto nuevo
    //     socket.on('agregarProducto', async data=>{
    //         const { title, description,price, thumbnail,code,stock,status, category} = data
    //         console.log (data)
    //         await productManager.addProduct (title, description,price, thumbnail,code,stock,status, category)
    //      })      
         
    //       //eliminar producto 
        socket.on('eliminarProducto', async data=>{
            const { id } = data
            console.log ('socket', id)
            await productManager.deleteProduct(id)
         })      

    //    //Enviar productos a todos los clientes
       const productos= await (productManager.getProducts());
       socket.emit("cargarProductos",  productos);

    });

    res.render('realtimeproducts', { 
        //productos
    })
   
})
export default router