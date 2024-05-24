import bcrypt from 'bcrypt'

export const createHash=  password => bcrypt.hashSync(password,bcrypt.genSalt(10))

//pass ingresado en login 
export const isValidPassword= (password, user) => bcrypt.compareSync(password, user.password)
