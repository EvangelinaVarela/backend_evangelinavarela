import express from 'express'
import session from 'express-session'
import handlebars from 'express-handlebars'
import cors from 'cors'

import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUIExpress from 'swagger-ui-express'

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
import { compareSync } from 'bcrypt'

const {port}= configObject

const app = express()

app.use(addLogger)

//Swagger
const swaggerOptions={
    definition:{
        openapi: '3.0.1',
        info:{
            title: 'Documentacion de EComerce',
            description: 'Api para realizar gestion de ecomerce'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

const httpServer = app.listen(port, error => {
    if(error) logger.error(error)
    logger.info(`Escuchando en el puerto ${port}`)
})
// creamos el socket server
const io = new Server(httpServer)

app.use(cors())
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

const specs= swaggerJsDoc(swaggerOptions)
app.use('/apidocs', swaggerUIExpress.serve, swaggerUIExpress.setup(specs))

app.use(routerApp)
app.use(handleErrors())
connectDB()
