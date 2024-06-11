
export const authorization = role =>{
    return (req, res, next) =>{
       if(!req.user) return res.status(401).send("Unauthorized")
        if(req.user.role !== role) return res.status(401).send("No estas autorizado")
        next()
    }
}