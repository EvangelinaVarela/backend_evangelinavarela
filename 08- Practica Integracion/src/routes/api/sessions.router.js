import { Router } from 'express'

import usersManagerMongoose from '../../daos/userManagerMongoose.js'
import cartsManagerMongoose from '../../daos/cartsManagerMongoose.js'

import { compareSync } from 'bcrypt';
import { createHash, isValidPassword } from '../../utils/bcrypt.js';
import passport from 'passport';
import { generateToken } from '../../utils/jwt.js';

import { auth } from '../../middlewares/auth.middleware.js';
import { authorization } from "../../middlewares/authorization.middleware.js";
import { passportCall } from '../../middlewares/passportCall.middleware.js';

import { currentStrategy  } from '../../middlewares/currentStrategy.middleware.js'

//const userService = new usersManagerMongoose();
const userManager = new usersManagerMongoose();
const router = Router()

router.post('/login', async(req, res) => {
    try
    {
    const { email, password} = req.body
    if (!email || !password) return res.status(401).send({status: 'error', error: 'Faltan ingresar datos'})

    const userExist = await userManager.getUserBy({email})
    if (!userExist) return res.status(400).send({status: 'error', error: 'El usuario no existe'})

    const isValid= isValidPassword(password, userExist)
   
    if (!isValid){
        console.log ('IsValid passport',isValid)
        return res.status(400).send({status: 'error', error: 'Credenciales incorrectas'})
    }

    const token= generateToken({
        email,
        firts_name:userExist.firts_name,
        role:userExist.role,
        id:userExist._id
    })

    return res.cookie('token', token,{
    maxAge: 60*60*1000*24,
    httpOnly:true
    }).redirect('/products')
}catch (error){
   return res.status(500).send('Error 500 en el server')
   console.log (error)
}
})

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

router.post('/register', async(req, res) => {
try
    {

    const {firts_name, last_name, email, password, age} = req.body
    
    if (!email || !password || !firts_name || !last_name) return res.status(401).send({status: 'error', error: 'Faltan ingresar datos'})
    
    const UserExist = await userManager.getUserBy({email})
    if (UserExist) return res.status(401).send({status: 'error', error: 'El usuario ya existe'})

    const cartsService = new cartsManagerMongoose()
    let newCarts= await cartsService.createCart()
    
    const newUser={
        firts_name,
        last_name,
        age,
        email,
        password: createHash(password),
      //  role:'admin',
        carts: newCarts
    }
   const result = await userManager.createUser(newUser)
   
   const token= generateToken({
    email,
    firts_name,
    role:result.role,
    id:result._id
   })

   if (result)
   {
    //  return res.cookie('token', token,{
    //     maxAge: 60*60*1000*24,
    //     httpOnly:true
    //  }).status(200).send({ status: 'success',  message: 'usuario registrado' })
     return res.cookie('token', token,{
        maxAge: 60*60*1000*24,
        httpOnly:true
        }).redirect('/products')
   }
}catch (error){
   console.log (error)
   return res.status(500).send('Error 500 en el server')
}
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
router.get('/current', passportCall('jwt'),authorization('admin'), async (req, res) => {
    console.log('Usuario current', req.user )
    const user= req.user
    res.send(`Bienvenido ${user.firts_name} (${user.email})`);
})
 
router.get('/logout',async(req, res) => {
    try
    {
        res.clearCookie('token');
        res.redirect('/')

}catch (error){
   return res.status(500).send('Error 500 en el server')
   console.log (error)
}
})
export default router