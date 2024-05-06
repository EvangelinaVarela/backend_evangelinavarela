import express from 'express'
import { __dirname } from './utils.js'

// motor de plantilla
import handlebars from 'express-handlebars'

import productsRouter  from './routes/api/products.router.js'
import cartsRouter  from './routes/api/carts.routes.js'
import messageRouter  from './routes/api/message.routes.js'

import  messageSocket  from './utils/messageSocket.js'

import { connectDB } from './config/index.js'

import { Server, Socket } from 'socket.io'

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
app.set('views', __dirname+'/views')
app.set('view engine', 'handlebars')

connectDB()
app.use(messageSocket(io))

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/chat', messageRouter)

//const messages = []
// io.on('connection', socket=>{
//     console.log('Cliente conectado app.js')
//     socket.on('message', data => {
//         console.log('message data: ', data)
//         // guardamos los mensajes
//         messages.push(data)
//         // emitimos los mensajes
//         io.emit('messageLogs', messages)
//     })
// })

