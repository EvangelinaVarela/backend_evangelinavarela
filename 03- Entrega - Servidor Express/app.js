const express = require('express')
//import express from 'express'

const ProductManager = require('./ProductManager.js')

const app = express()
// para poder leer los json
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const productManager= new ProductManager("./productos.json");

app.get('/getProducts', async  (req, res)=>{
    try
    {
    const { limit } = req.query
  
    const productos= await (productManager.getProducts());
     if (!limit)
     {
       // res.status(200).send({ status: 'success', payload: productos })
        res.send({status: 'success', payload: productos})
     }
     else
     {
        const productosLimit = productos.slice(0, parseInt(limit));
        res.status(200).send({ status: 'success', payload: productosLimit })
     }
    }
    catch (error){

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

