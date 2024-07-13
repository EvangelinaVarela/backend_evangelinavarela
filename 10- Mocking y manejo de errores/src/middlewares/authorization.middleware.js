
export const authorization = role =>{
    return (req, res, next) =>{
       const user= req.user.user
       if(!req.user) return res.status(401).send("No esta autorizado")
       // console.log ('authorization', user.role)
        if(user.role !== role) return res.status(401).send("No tiene permisos")
        next()
    }
}
