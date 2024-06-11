import express from 'express'

import session from 'express-session'

import { __dirname } from './utils.js'

// motor de plantilla
import handlebars from 'express-handlebars'

import productsRouter  from './routes/api/products.router.js'
import cartsRouter  from './routes/api/carts.routes.js'
import messageRouter  from './routes/api/message.routes.js'
import sessionRouter  from './routes/api/sessions.router.js'
import viewsRouter from './routes/views.router.js'

import  messageSocket  from './utils/messageSocket.js'

import { connectDB } from './config/index.js'

import { Server, Socket } from 'socket.io'

import MongoStore from 'connect-mongo'

// passport 
import passport from 'passport'
import { initializePassport } from './config/passport.config.js'


import cookieParser from 'cookie-parser'

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
app.use(cookieParser())

// express usa este motor de plantillas
app.engine('handlebars', handlebars.engine())

// seteamos la dirección de mis vistas (plantlillas)
app.set('views', __dirname+'/views')
app.set('view engine', 'handlebars')

// sessions con mongo - db
app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://evangelinavarela:evangelina1234@cluster0.l5uohuv.mongodb.net/ecommerce',//'mongodb://127.0.0.1:27017/c53145',
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 60 * 60 * 1000 * 24
    }),
    secret: 's3cr3etC@d3r',
    resave: true,
    saveUninitialized: true
}))
initializePassport() 
app.use(passport.initialize())
app.use(passport.session())

connectDB()
app.use(messageSocket(io))

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/chat', messageRouter)
app.use('/api/sessions', sessionRouter)
app.use('/', viewsRouter)

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

