import { Router } from 'express'

import usersManagerMongoose from '../../daos/userManagerMongoose.js'

import { compareSync } from 'bcrypt';
import { auth } from '../../middlewares/auth.middleware.js';
//const userService = new usersManagerMongoose();
const userManager = new usersManagerMongoose();
const router = Router()

router.post('/login', async(req, res) => {
    try
    {
    const { email, password} = req.body
    if (!email || !password) return res.status(401).send({status: 'error', error: 'Faltan ingresar datos'})

    const userExist = await userManager.getUserBy({email})
    if (!userExist) return res.status(401).send({status: 'error', error: 'El usuario no existe'})
     
    if (password !== userExist.password)    {
        return res.status(401).send({status: 'error', error: 'Contraseña incorrecta'})
    }

    req.session.user={
        email,
        first_name: userExist.firts_name,
        admin: userExist.role === 'admin'
    }

    res.status(200).redirect('/products');
}catch (error){
   return res.status(500).send('Error 500 en el server')
   console.log (error)
}
})

router.post('/register', async(req, res) => {
    try
    {
    console.log (req.body)
    const {first_name, last_name, email, password} = req.body
    console.log ('datos reg',first_name, last_name, email, password)    
    if (!email || !password || !first_name || !last_name) return res.status(401).send({status: 'error', error: 'Faltan ingresar datos'})
    
    const UserExist = await userManager.getUserBy({email})
    if (UserExist) return res.status(401).send({status: 'error', error: 'El usuario ya existe'})
    
    const newUser={
        first_name,
        last_name,
        email,
        password//, role: 'admin'
    }
    
   const result = await userManager.createUser(newUser)
   console.log (result)
   if (result)
   {
     return res.status(200).send({ status: 'success', payload:('Usuario Registrado') })
   }
   
}catch (error){
   return res.status(500).send('Error 500 en el server')
   console.log (error)
}
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