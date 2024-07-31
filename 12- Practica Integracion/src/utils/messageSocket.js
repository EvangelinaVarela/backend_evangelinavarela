const messageSocket = (socketServer) => {
    return (req, res, next) => {
        //console.log ('entra a message socket')
        req.socketServer = socketServer
        return next()
    }
}

export default messageSocket