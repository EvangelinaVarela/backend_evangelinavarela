import { compareSync } from 'bcrypt';
import {userService} from '../service/index.js'
import { logger } from '../utils/logger.js'

export default class  UserCotroller
{
    constructor(){
    }

    getUsers =  async  (req, res)=>{
        try
        {
        let { limit , nropage} = req.query
        
        if (typeof limit === "undefined") {
          limit = 10;
       }
    
       if (typeof nropage === "undefined") {
          nropage = 1;
       }
        
       const users = await  userService.getUsers(limit, nropage) //
       return res.status(200).send({status: 'success', payload: users})
        }
        catch (error){
            logger.error(error)
            return res.status(500).send('Error 500 en el server')
        }
    }
  
    changeUserRole=  async (req, res) => {
        const { uid } = req.params
 
        let userDB = await userService.getUser( {_id: uid})
        if (!userDB) return res.status(400).send({status: 'error', message: 'El usuario no existe'})
       
       if (userDB.role!=='admin') {
            if (userDB.role=='user') 
            {    
                if (!userDB.documents || userDB.documents.length < 3) {
                    return res.status(400).send({status: 'error',
                        error: `El usuario no ha terminado de procesar su documentación. Falta ${3 - userDB.documents.length} documento.` })
                }
            }
           userDB.role = userDB.role === 'user' ? 'premium' : 'user';
       } else
       {
          return res.status(400).send({status: 'error', message: 'No se puede cambiar el role de un usuario ADMIN'})
       }
       const result = await userService.updateUser(userDB._id, userDB)
       if (!result) return res.status(400).send({status: 'error', message: 'Error al actualizar el cambio de role'})

       res.status(200).send({
           status: 'success', 
           message: 'El cambio de role se realizo correctamente.'
       })
    }

    addDocuments=  async (req, res) => {
        const { uid } = req.params
      
        let files
        if (req.files.documents && req.files.documents.length > 0) {
            files = req.files.documents;
        } else if (req.files.profile && req.files.profile.length > 0) {
            files = req.files.profile;   
        } else if (req.files.products && req.files.products.length > 0) {
            files = req.files.products;   
        } else {
            files = [];  
        }
        
        if (!files ) {
            return res.status(400).json({status: 'error', error: 'Faltan datos o archivos requeridos.' })
        }

        let userDB = await userService.getUser( {_id: uid})
        if (!userDB) return res.status(400).send({status: 'error', message: 'El usuario no existe'})

        files.forEach((file) => {
            userDB.documents.push({
                name: file.filename,
                reference: file.destination 
            })
        })

       const result = await userService.updateUser(userDB._id, userDB) 

       res.status(200).send({
           status: 'success', 
           message: 'Los archivos se subieron correctamente.'
       })
    }
}