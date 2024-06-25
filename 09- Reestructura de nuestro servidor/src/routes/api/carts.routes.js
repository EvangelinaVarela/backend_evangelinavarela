import { Router } from 'express'

import CartController from '../../controllers/carts.controllers.js';

const router = Router()

const {
    createCart,
    getCart,
    addCart,
    deleteCartProduct,
    deleteCart, updateCartProduct,addManyCartProducts}= new CartController()

router.post('/', createCart)
router.get('/:cid', getCart)
router.post('/:cid/product/:pid',addCart)
router.delete('/:cid/product/:pid',deleteCartProduct)
router.delete('/:cid',deleteCart)
router.put('/:cid',addManyCartProducts)
router.put('/:cid/product/:pid',updateCartProduct)

export default router