const express = require('express')

const ProductManager = require('./ProductManager.js')

const app = express()
const productManager= new ProductManager("./productos.json");

app.get('/getProducts', async  (req, res)=>{
    const { limit } = req.query
  
    const productos= await (productManager.getProducts());
     if (!limit)
     {
        res.send(productos)
     }
     else
     {
        const productosLimit = productos.slice(0, parseInt(limit));
        res.send(productosLimit)
     }
   
})

app.get('/getProducts/:pid', async (req, res)=>{
    const { pid } = req.params
    const producto= await (productManager.getProductById(parseInt(pid)));
    if (!producto)
    {
        res.send(`No existe el producto con ID ${pid} `)
    }
    res.send(producto)
})

app.listen(8080, error => {
    console.log('Escuchando el puerto 8080')
})

