export default class UserRepositories{

    constructor(UserDao){
        this.UserDao= UserDao
    }

    async createUser(newUser)
    {
        try
        {
            return await this.UserDao.createUser(newUser)
        }   
        catch (error)
        {
            return error
        }
    }

    async getUser(email)
    {
        try
        {
            return await this.UserDao.getUser(email)
        }   
        catch (error)
        {
            return error
        }
    }

    async getUserDTO(email)
    {
        try
        {
            return await this.UserDao.getUserDTO(email)
        }   
        catch (error)
        {
            return error
        }
    }
    
}