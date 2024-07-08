import { Router } from "express"

import productsRouter  from './api/products.router.js'
import cartsRouter  from './api/carts.routes.js'
import messageRouter  from './api/message.routes.js'
import sessionRouter  from './api/sessions.router.js'
import viewsRouter from './views.router.js'

const router= Router() 

router.use('/api/products', productsRouter)
router.use('/api/carts', cartsRouter)
router.use('/chat', messageRouter)
router.use('/api/sessions', sessionRouter)
router.use('/', viewsRouter)

export default router