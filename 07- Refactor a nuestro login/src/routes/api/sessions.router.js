import { Router } from 'express'

import usersManagerMongoose from '../../daos/userManagerMongoose.js'

import { compareSync } from 'bcrypt';
import { auth } from '../../middlewares/auth.middleware.js';
import { createHash, isValidPassword } from '../../utils/bcrypt.js';
import passport from 'passport';

//const userService = new usersManagerMongoose();
const userManager = new usersManagerMongoose();
const router = Router()

// router.post('/login', async(req, res) => {
//     try
//     {
//     const { email, password} = req.body
//     if (!email || !password) return res.status(401).send({status: 'error', error: 'Faltan ingresar datos'})

//     const userExist = await userManager.getUserBy({email})
//     if (!userExist) return res.status(400).send({status: 'error', error: 'El usuario no existe'})
        
//     const isValid= isValidPassword(password, {password: userExist.password})

//     //if (password !== userExist.password)    {
//     if (!isValid){
//         return res.status(401).send({status: 'error', error: 'Contraseña incorrecta'})
//     }

//     req.session.user={
//         email,
//         first_name: userExist.firts_name,
//         admin: userExist.role === 'admin'
//     }

//     res.status(200).redirect('/products');
// }catch (error){
//    return res.status(500).send('Error 500 en el server')
//    console.log (error)
// }
// })

router.post('/login', passport.authenticate('login', {failureRedirect: '/api/sessions/faillogin'}),async (req, res) => {
    if(!req.user) return res.status(400).send({status: 'error', error: 'credenciales invalidas'})
        console.log ('Login passport:', req.session.user)
        req.session.user={
        email:req.user.email,
        first_name: req.user.firts_name,
        admin: req.user.role === 'admin'
     }
    res.status(200).redirect('/products');
})

router.post('/register', passport.authenticate('register', {failureRedirect: '/api/sessions/failregister'}), async (req, res) => {
   res.send({status: 'success', message: 'Usuario Registrado'})
})

router.get('/faillogin', (req, res) => {
    //res.send({error: 'falló el login'})
    return res.status(401).send('Falló el login')
})

router.get('/failregister', (req, res) => {
    //res.send({error: 'falló el login'})
    return res.status(401).send('Falló el registro del usuario')
})

// router.post('/register', async(req, res) => {
//     try
//     {
//     //console.log (req.body)
//     const {firts_name, last_name, email, password} = req.body
//     //console.log ('datos reg',firts_name, last_name, email, password)    
//     if (!email || !password || !firts_name || !last_name) return res.status(401).send({status: 'error', error: 'Faltan ingresar datos'})
    
//     const UserExist = await userManager.getUserBy({email})
   
//     if (UserExist) return res.status(401).send({status: 'error', error: 'El usuario ya existe'})
    
//     const newUser={
//         firts_name,
//         last_name,
//         email,
//         password: createHash(String(password))
//        // , role: 'admin'
//     }
//    const result = await userManager.createUser(newUser)
   
//    if (result)
//    {
//      return res.status(200).send({ status: 'success', payload:('Usuario Registrado') })
//    }
   
// }catch (error){
//    console.log (error)
//    return res.status(500).send('Error 500 en el server')
// }
// })



//passport.authenticate('github', {scope: 'user:email'})
router.get('/github', passport.authenticate('github', {scope: 'user:email'}), async (req, res)=>{})


router.get('/githubcallback', passport.authenticate('github',{failureRedirect: '/login'}),async (req, res)=>{
  //  req.session.user = req.user
 // console.log('Git callback user', req.session.user)
  req.session.user={
    email:req.user.email,
    first_name: req.user.firts_name,
    admin: req.user.role === 'admin'
}
  //  return res.status(200).send({ status: 'success', payload:('entro a git call') })
   res.redirect('/products')
})

router.get('/current', auth,(req, res)=>{
    res.send('datos sensibles')
})
 
router.get('/logout',async(req, res) => {
    try
    {
        req.session.destroy( err => {
            if(err) return res.send({status: 'error', error: err})
            else return res.redirect('/')
        })
}catch (error){
   return res.status(500).send('Error 500 en el server')
   console.log (error)
}
})
export default router