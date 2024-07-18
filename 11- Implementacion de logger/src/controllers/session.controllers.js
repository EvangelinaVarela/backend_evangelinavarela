// import userManagerMongoose from "../daos/mongo/userManagerMongoose.js";
// import cartsManagerMongoose from '../daos/mongo/cartsManagerMongoose.js'

import { userService, cartService } from '../service/index.js'

import { compareSync } from 'bcrypt';
import { createHash, isValidPassword } from '../utils/bcrypt.js';

import passport from 'passport';
import { generateToken } from '../utils/jwt.js';

import { auth } from '../middlewares/auth.middleware.js';
import { authorization } from "../middlewares/authorization.middleware.js";
import { passportCall } from '../middlewares/passportCall.middleware.js';

import { currentStrategy  } from '../middlewares/currentStrategy.middleware.js'
import { logger } from '../utils/logger.js'

class UserCotroller
{
    constructor(){
     }

     loginUser = async(req, res) => {
        try
        {
        const { email, password} = req.body
        if (!email || !password) return res.status(401).send({status: 'error', error: 'Faltan ingresar datos'})
        const userExist = await userService.getUser({email})

        if (!userExist) return res.status(400).send({status: 'error', error: 'El usuario no existe'})

        const isValid= isValidPassword(password, userExist)
       
        if (!isValid){
            return res.status(400).send({status: 'error', error: 'Credenciales incorrectas'})
        }
        const { firts_name, last_name, role, cart } = userExist
        const token = generateToken({user:{
            email,
            firts_name,
            last_name, 
            role,
            cart
        }, expiresIn: '24h'})
        req.user= userExist

        return res.cookie('token', token,{
        maxAge: 60*60*1000*24,
        httpOnly:true
        }).redirect('/products')
    }catch (error){
        logger.error(error)
       return res.status(500).send('Error 500 en el server')
    }
    }

    registerUser =  async(req, res) => {
        try
            {
            const {firts_name, last_name, email, password, age} = req.body
           
            if (!email || !password || !firts_name || !last_name) return res.status(401).send({status: 'error', error: 'Faltan ingresar datos'})
            
            const UserExist = await  userService.getUser({email})
            if (UserExist) return res.status(401).send({status: 'error', error: 'El usuario ya existe'})
            
            let newCarts= await cartService.createCart()

            const newUser={
                firts_name,
                last_name,
                age,
                email,
                password: createHash(password),
                //role:'admin',
                cart: newCarts
            }
           const result = await userService.createUser(newUser)
           const userExist = await userService.getUser({email})
           const { role, cart } = userExist
           const token = generateToken({user:{
            email,
            firts_name,
            last_name, 
            role,
            cart
        }, expiresIn: '24h'})
        req.user= userExist
        
           if (result)
           {
            req.user= result
             return res.cookie('token', token,{
                maxAge: 60*60*1000*24,
                httpOnly:true
                }).redirect('/products')
           }
        }catch (error){
           console.log (error)
           return res.status(500).send('Error 500 en el server')
        }
    }
    
    currentUser=  async (req, res) => {
       const user=  req.user.user
       logger.info('Usuario current',user.email)
    
       const userDTO = await userService.getUserDTO({ email: user.email })
       res.send(`Bienvenido ${userDTO.full_name} `);
    }

    logout=async(req, res) => {
        try
        {
            res.clearCookie('token');
            res.redirect('/')
    }catch (error){
       return res.status(500).send('Error 500 en el server')
       logger.error(error)
    }
    }

}

export default UserCotroller