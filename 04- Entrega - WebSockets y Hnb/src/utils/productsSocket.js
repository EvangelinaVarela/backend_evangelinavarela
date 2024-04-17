const productsSocket = (socketServer) => {
    return (req, res, next) => {
        req.socketServer = socketServer
        //console.log (req.socketServer)
        return next()
    }

}

export default productsSocket