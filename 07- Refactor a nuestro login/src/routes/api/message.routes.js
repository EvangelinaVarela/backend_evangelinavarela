import { Router } from 'express'

import messageManagerMongoose from '../../daos/messageManagerMongoose.js'

const messageManager = new messageManagerMongoose();

const router = Router()

router.get('/', (req, res)=>{
    const { socketServer } = req
    socketServer.on('connection', async (socket) => {
        console.log('Un cliente se ha conectado desde router');

         socket.on('message',async data => {
             console.log('message data: ', data)
             const result =  messageManager.addMessage(data)
    
             const mensajes = await(messageManager.getMessages())
    
             socket.emit('messageLogs', mensajes)
     })
    });

    res.render('chat')
})


export default router