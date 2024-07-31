import { Router } from 'express'
import sessionCotroller from '../../controllers/session.controllers.js';

import { passportCall } from '../../middlewares/passportCall.middleware.js'
import { authorization } from "../../middlewares/authorization.middleware.js";

const {changeUserRole}= new sessionCotroller()

const router = Router()

router.post('/premium/:uid', changeUserRole)

export default router