import { Router } from "express"

import productsRouter  from './api/products.router.js'
import cartsRouter  from './api/carts.routes.js'
import messageRouter  from './api/message.routes.js'
import sessionRouter  from './api/sessions.router.js'
import usersRouter  from './api/users.routes.js'
import viewsRouter from './views.router.js'
import { generateProduct } from "../utils/generateProductMock.js"
import { passportCall } from '../middlewares/passportCall.middleware.js'

const router= Router() 

router.use('/api/products', productsRouter)
//Agregar a carts passportCall('jwt') lo quite para probar desde postman
router.use('/api/carts',cartsRouter)
router.use('/chat', messageRouter)
router.use('/api/sessions', sessionRouter)
router.use('/api/users', usersRouter)
router.use('/', viewsRouter)

router.get('/loggerTest', (req, res) => {
    req.logger.debug('Log Debug')
    req.logger.http('Log http')
    req.logger.fatal('Log Fatal!!')
    req.logger.warning('Log Alerta!!')
    req.logger.error('Log Error!!')
    res.send('EndPoint test logs ')
})


export default router