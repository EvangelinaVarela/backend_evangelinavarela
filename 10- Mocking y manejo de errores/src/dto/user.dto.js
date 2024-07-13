class UserDTO {
    constructor(newUser){
        this.Id= newUser._Id
       // this.firts_name = newUser.nombre
        //this.last_name  = newUser.apellido
        this.full_name  = `${newUser.firts_name} ${newUser.last_name}`
    }
}

export default UserDTO

