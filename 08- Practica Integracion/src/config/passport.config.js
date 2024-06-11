import passport from 'passport'
import jwt from 'passport-jwt'

//import { Strategy as GitHubStrategy }  from 'passport-github2'
//const GitHubStrategy = require('passport-github2').Strategy;
import usersManagerMongoose from '../daos/userManagerMongoose.js'
import cartsManagerMongoose from '../daos/cartsManagerMongoose.js'
import { createHash, isValidPassword } from '../utils/bcrypt.js'

import { PRIVATE_KEY } from '../utils/jwt.js'

// import local from 'passport-local'

// const LocalStrategy = local.Strategy

const userService = new usersManagerMongoose()

const JWTStrategy = jwt.Strategy
const ExtractJWT  = jwt.ExtractJwt

// función creada por nosotros para leer las cookie
export const cookieExtractor = req => {
    let token = null
    if (req && req.cookies) {
        token = req.cookies['token']
    }
    return token
}

export const initializePassport  = () => 
{
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY
    }, async (jwt_payload, done) => {
        try {
            // if(true) return done(null, false, {messages: 'No user found'})
            console.log (jwt_payload)
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }))
   

    // passport.use('github',new GitHubStrategy ({
    //     clientID:"Iv23liYJXFGHC1cmmNam",
    //     clientSecret:"19d89f7a597767afc28eaa5285e397e687a4f16d",
    //     callbackURL:'http://localhost:8080/api/sessions/githubcallback'
        
    // }, async(accesToken, refreshToken, profile, done)=>{
    //     try{
    //        // console.log('entro a github',profile._json)
    //         let user  = await userService.getUserBy({email: profile._json.email})
    //         // no existe el usuario en nuestra base de datos
    //         if(!user){
    //             let newUser = {
    //                 firts_name: profile._json.name,
    //                 last_name: profile._json.name,
    //                 email: profile._json.email,
    //                 password: ''
    //             }
    //             let result = await userService.createUser(newUser) 
    //             done(null, result)
    //         }else{
    //             done(null, user)
    //         }
    //     }
    //      catch (err) {
    //         console.log ('error github', err)
    //         return done(err)
    //     }
    // }))

    // passport.use('register', new LocalStrategy({
    //     passReqToCallback: true, // req -> body -> passaport -> obj Req
    //     usernameField: 'email'
    // }, async( req, username, password, done ) => {
    //       const { firts_name, last_name, age } = req.body
    //         try {
    //             // verificar si existe el usuario
    //             let userFound = await userService.getUserBy({email: username})
    //             if(userFound) {
    //                 //console.log('El usuario ingresado ya existe')
    //                 return done(null, false)
    //             }

    //             const cartsService = new cartsManagerMongoose()
    //             let newCarts= await cartsService.createCart()

    //             // crear el uusario 
    //             let newUser = {
    //                 firts_name,
    //                 last_name,
    //                 age,
    //                 email: username,
    //                 password: createHash(password),
    //               //  role:'admin',
    //                 carts: newCarts
    //             }
    //             let result = await userService.createUser(newUser) // _id
    //             return done(null, result)
    //         } catch (error) {
    //             return done('Error al registrar el usuario: '+ error)   
    //         }
    // }))


    // passport.use('login', new LocalStrategy({
    //     usernameField: 'email'
    // }, async(username, password, done)=>{
    //     try {
            
    //         const user = await userService.getUserBy({email: username})
    //         if(!user) {
    //             console.log('usuario no encontrado')
    //             return done(null, false)
    //         }
    //         const isValid= isValidPassword(password, user)
    //         if (!isValid){
    //             console.log ('IsValid passport',isValid)
    //             return done(null, false)
    //         }
    //         return done(null, user) 
    //     } catch (error) {
    //         return done(error)
    //     }
    // }))


    passport.serializeUser((user, done)=>{
        done(null, user._id)
    }) // _id-> session

    passport.deserializeUser(async(id, done)=>{
        try {
            let user = await userService.getUserBy({_id: id})
            done(null, user)
        } catch (error) {
            done(error)
        }
    }) // session -> user
}