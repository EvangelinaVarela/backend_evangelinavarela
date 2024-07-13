import { Router } from "express"

import productsRouter  from './api/products.router.js'
import cartsRouter  from './api/carts.routes.js'
import messageRouter  from './api/message.routes.js'
import sessionRouter  from './api/sessions.router.js'
import viewsRouter from './views.router.js'
import { generateProduct } from "../utils/generateProductMock.js"



const router= Router() 

router.use('/api/products', productsRouter)
router.use('/api/carts', cartsRouter)
router.use('/chat', messageRouter)
router.use('/api/sessions', sessionRouter)
router.use('/', viewsRouter)

router.get('/mockingproducts', (req, res) => {
    let products = []

    for (let i = 0; i < 50; i++) {
        products.push(generateProduct())      
    }

    res.send({
        status: 'success',payload: products
    })
})

export default router