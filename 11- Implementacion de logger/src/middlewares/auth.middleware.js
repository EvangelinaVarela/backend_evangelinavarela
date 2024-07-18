export function auth (req, res, next){
    if(req.session?.user?.admin){
        return next()
    }
    return res.status(401).send("No estas autorizado")
}

// export function auth(req, res, next) {
//     console.log ('Usuario authorizacion Midd', req.user)

//     if(req.user?.admin) {
//         return next()
//     }

//     return res.status(401).send('error de autorización')
// }
// export const auth = (role) => {
//     return async (res, req, next) =>{
//         console.log ('Usuario authorizacion Midd', req.user)
//         if(!req.user) return res.status(401).send('error de autorización')
//         if(req.user.role !== role) return res.status(403).send('No tiene permisos')
//         next()
//     }
// }