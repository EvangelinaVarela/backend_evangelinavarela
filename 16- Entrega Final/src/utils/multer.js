import multer from 'multer'
import jwt from 'jsonwebtoken'
import {dirname} from "path"
import fs from 'fs'
import { __dirname } from '../../src/utils.js'
import { generateToken,PRIVATE_KEY } from '../../src/utils/jwt.js';

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname +'/public/upload')
       // callback(null,`${dirname(__dirname)}/public/uploads`)
    },
    filename: function (req, file, callback) {
        callback(null, `${Date.now()}-${file.originalname}`)
        
    }
})

export const uploader = multer({
    storage
})