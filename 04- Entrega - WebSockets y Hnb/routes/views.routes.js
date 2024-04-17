import { Router } from 'express'

import ProductManager from '../src/ProductManager.js'
const productManager= new ProductManager("./productos.json");

const router = Router()

// endpoint en ruta raíz
router.get('/', async (req, res)=>{
    const productos= await (productManager.getProducts());
    res.render('home', { 
        productos
    })
})

router.get('/realtimeproducts',  async(req, res)=>{
    const { socketServer } = req

    socketServer.on('connection', async (socket) => {
        console.log('Un cliente se ha conectado');
        
        //agrega producto nuevo
        socket.on('agregarProducto', async data=>{
            const { title, description,price, thumbnail,code,stock,status, category} = data
            console.log (data)
            await productManager.addProduct (title, description,price, thumbnail,code,stock,status, category)
         })      
         
          //eliminar producto 
        socket.on('eliminarProducto', async data=>{
            const { id } = data
            console.log (data)
            await productManager.deleteProduct (parseInt(id))
         })      

       //Enviar productos a todos los clientes
       const productos= await (productManager.getProducts());
       socket.emit("cargarProductos",  productos);

    });

    res.render('realtimeproducts', { 
        //productos
    })
   
})


export default router