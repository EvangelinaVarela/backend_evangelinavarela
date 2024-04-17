import express from 'express'
import productsRouter  from './routes/products.routes.js'
import cartsRouter  from './routes/carts.routes.js'
import viewsRouter from './routes/views.routes.js'
import { __dirname } from './utils.js'

import  productsSocket  from './src/utils/productsSocket.js'

// motor de plantilla
import handlebars from 'express-handlebars'
// socket io
import { Server } from 'socket.io'

const app = express()

const PORT = process.env.PORT || 8080
const httpServer = app.listen(PORT, error => {
    if(error) console.log(error)
    console.log('Server escuchando en el puerto 8080')
})
// creamos el socket server
const io = new Server(httpServer)

// para poder leer los json
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname+'/public'))


// express usa este motor de plantillas
app.engine('handlebars', handlebars.engine())
// seteamos la dirección de mis vistas (plantlillas)
app.set('views', __dirname+'/src/views')
app.set('view engine', 'handlebars')

app.use(productsSocket(io))

app.use('/', viewsRouter)

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

app.use((error, req, res, next) => {
    console.log(error)
    res.status(500).send('Error 500 en el server')
})

// io.on('connection', socket => {
//     console.log('Cliente conectado')
   
// })