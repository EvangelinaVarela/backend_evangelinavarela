import userManagerMongoose from "../daos/userManagerMongoose.js";
import cartsManagerMongoose from '../daos/cartsManagerMongoose.js'

import { compareSync } from 'bcrypt';
import { createHash, isValidPassword } from '../utils/bcrypt.js';

import passport from 'passport';
import { generateToken } from '../utils/jwt.js';

import { auth } from '../middlewares/auth.middleware.js';
import { authorization } from "../middlewares/authorization.middleware.js";
import { passportCall } from '../middlewares/passportCall.middleware.js';

import { currentStrategy  } from '../middlewares/currentStrategy.middleware.js'


class UserCotroller
{
    constructor(){
        this.userService=  new userManagerMongoose()
        this.cartsService= new cartsManagerMongoose()
     }

     loginUser = async(req, res) => {
        try
        {
        const { email, password} = req.body
        if (!email || !password) return res.status(401).send({status: 'error', error: 'Faltan ingresar datos'})
    
        const userExist = await this.userService.getUserBy({email})
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
    }

    registerUser =  async(req, res) => {
        try
            {
            const {firts_name, last_name, email, password, age} = req.body
            console.log ('Register', firts_name, last_name, email, password, age)
            if (!email || !password || !firts_name || !last_name) return res.status(401).send({status: 'error', error: 'Faltan ingresar datos'})
            
            const UserExist = await  this.userService.getUserBy({email})
            if (UserExist) return res.status(401).send({status: 'error', error: 'El usuario ya existe'})
        
            //const cartsService = new cartsManagerMongoose()
            let newCarts= await this.cartsService.createCart()
            
            const newUser={
                firts_name,
                last_name,
                age,
                email,
                password: createHash(password),
              //  role:'admin',
                carts: newCarts
            }
           const result = await this.userService.createUser(newUser)
           
           const token= generateToken({
            email,
            firts_name,
            role:result.role,
            id:result._id
           })
        
           if (result)
           {
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
    
    currentUser=   async (req, res) => {
        console.log('Usuario current', req.user )
        const user= req.user
       res.send(`Bienvenido ${user.firts_name} (${user.email})`);
    }

    logout=async(req, res) => {
        try
        {
            res.clearCookie('token');
            res.redirect('/')
    
    }catch (error){
       return res.status(500).send('Error 500 en el server')
       console.log (error)
    }
    }

}

export default UserCotroller