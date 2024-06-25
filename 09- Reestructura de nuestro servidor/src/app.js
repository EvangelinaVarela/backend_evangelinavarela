import express from 'express'
import session from 'express-session'
import handlebars from 'express-handlebars'
import dotenv from 'dotenv';
import { Server, Socket } from 'socket.io'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import cookieParser from 'cookie-parser'

import routerApp from '../src/routes/index.js'
import { configObject } from './config/config.js';
import { __dirname } from './utils.js'
import  messageSocket  from './utils/messageSocket.js'
import { connectDB, objetConfig } from './config/index.js'
import { initializePassport } from './config/passport.config.js'

const {port}= objetConfig

const app = express()
//const PORT = process.env.PORT || 8080

const httpServer = app.listen(port, error => {
    if(error) console.log(error)
    console.log('Server escuchando en el puerto', port)
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
app.use(routerApp)

connectDB()
app.use(messageSocket(io))


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

