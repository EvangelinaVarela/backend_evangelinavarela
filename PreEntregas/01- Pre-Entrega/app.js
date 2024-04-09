import express from 'express'
import productsRouter  from './routes/products.routes.js'
import cartsRouter  from './routes/carts.routes.js'

const app = express()
// para poder leer los json
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// http://localhost:8080  /
app.get('/', (req, res)=>{
    res.status(200).send('<h1>Bienvenidos a E-Comerce - Evangelina Varela</h1>')
})

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

app.use((error, req, res, next) => {
    console.log(error)
    res.status(500).send('Error 500 en el server')
})

app.listen(8080, error => {
    if(error) console.log(error)
    console.log('Server escuchando en el puerto 8080')
})