import express from 'express'
import session from 'express-session'
import handlebars from 'express-handlebars'

import { Server, Socket } from 'socket.io'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import cookieParser from 'cookie-parser'

import routerApp from '../src/routes/index.js'
import { configObject } from './config/config.js';
import { __dirname } from './utils.js'
import  messageSocket  from './utils/messageSocket.js'

import { connectDB } from './config/index.js'

import { initializePassport } from './config/passport.config.js'
import { handleErrors } from './middlewares/errors/index.js'

import { addLogger , logger } from './utils/logger.js'

const {port}= configObject

const app = express()

app.use(addLogger)

const httpServer = app.listen(port, error => {
    if(error) logger.error(error)
    //console.log('Server escuchando en el puerto', port)
    logger.info(`Escuchando en el puerto ${port}`)
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

initializePassport() 
app.use(passport.initialize())
app.use(messageSocket(io))

app.use(routerApp)
app.use(handleErrors())
connectDB()
