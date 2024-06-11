import usersModel from '../models/users.model.js';

export class UserManagerMongoose {
   
  constructor()
  {        
  }

  
    async createUser(user) {
        console.log ('Create', user)
        const result = await usersModel.create(user)
        return result;    

    }
  
    async getUserBy(filter) {
      try {
        //console.log ('Get User', filter)
        const user = await usersModel.findOne(filter)
        return user;    
       } catch (error) {
           console.log(error.message)
       }

    }
  
    async getUserByEmail(email) {
      return this.users.find((user) => user.email === email);
    }
  
    async getUsers() {
      return this.users;
    }
  }

  export default UserManagerMongoose;