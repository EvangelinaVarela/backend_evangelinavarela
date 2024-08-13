
import { Router }  from 'express'

import ProductCotroller from '../../controllers/products.controllers.js';

//import { auth } from '../../middlewares/auth.middleware.js';
import { passportCall } from '../../middlewares/passportCall.middleware.js'
import { authorization } from "../../middlewares/authorization.middleware.js";

const router = Router()
const {
   getProduct,
   getProducts,
   createProduct,
   updateProduct,
   deleteProduct}= new ProductCotroller()

router.get('/',getProducts)
router.get('/:pid', getProduct)
//router.post('/',auth, createProduct)
//router.post('/',passportCall('jwt'),createProduct)
router.post('/',createProduct)
router.put('/:pid', updateProduct)
//router.delete('/:pid', auth,deleteProduct)
//router.delete('/:pid',passportCall('jwt'), deleteProduct)
router.delete('/:pid', deleteProduct)

export default router