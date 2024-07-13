import EErrors from "../../service/errors/enums.js";

export const handleErrors = () => ( error, req, res, next ) => {
    console.log('Error cause: ',error.cause)
    switch (error.code) {
        case EErrors.INVALID_TYPES_ERROR: 
            return res.send({status: 'error', error: error.name})
            break
        case EErrors.DATABASE_ERROR: 
            return res.send({status: 'error', error: error.name})
            break
        default:
            return res.send({status: 'error', error: 'error no identificado'})
    }
}