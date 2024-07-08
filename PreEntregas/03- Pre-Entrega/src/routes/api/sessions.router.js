import { Router } from 'express'
import sessionCotroller from '../../controllers/session.controllers.js';

import { passportCall } from '../../middlewares/passportCall.middleware.js'
import { authorization } from "../../middlewares/authorization.middleware.js";
import passport from 'passport';

const {
    loginUser,
    registerUser,
    currentUser,logout}= new sessionCotroller()

const router = Router()

router.post('/login', loginUser)
router.post('/register',registerUser)
router.get('/current', passportCall('jwt'),authorization('admin'),currentUser)
router.get('/logout',logout)


// router.post('/login', passport.authenticate('login', {failureRedirect: '/api/sessions/faillogin'}),async (req, res) => {
//     if(!req.user) return res.status(400).send({status: 'error', error: 'credenciales invalidas'})
//         console.log ('Login passport:', req.session.user)
//         req.session.user={
//         email:req.user.email,
//         first_name: req.user.firts_name,
//         admin: req.user.role === 'admin'
//      }
//     res.status(200).redirect('/products');
// })

// router.post('/register', passport.authenticate('register', {failureRedirect: '/api/sessions/failregister'}), async (req, res) => {
//    res.send({status: 'success', message: 'Usuario Registrado'})
// })


router.get('/faillogin', (req, res) => {
    //res.send({error: 'falló el login'})
    return res.status(401).send('Falló el login')
})

router.get('/failregister', (req, res) => {
    //res.send({error: 'falló el login'})
    return res.status(401).send('Falló el registro del usuario')
})


// //passport.authenticate('github', {scope: 'user:email'})
// router.get('/github', passport.authenticate('github', {scope: 'user:email'}), async (req, res)=>{})


// router.get('/githubcallback', passport.authenticate('github',{failureRedirect: '/login'}),async (req, res)=>{
//   //  req.session.user = req.user
//  // console.log('Git callback user', req.session.user)
//   req.session.user={
//     email:req.user.email,
//     first_name: req.user.firts_name,
//     admin: req.user.role === 'admin'
// }
//   //  return res.status(200).send({ status: 'success', payload:('entro a git call') })
//    res.redirect('/products')
// })

// router.get('/current', auth,(req, res)=>{
//     res.send('datos sensibles')
// })

export default router