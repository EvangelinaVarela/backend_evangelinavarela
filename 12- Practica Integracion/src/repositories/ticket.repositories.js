export default class TicketRepositories{

    constructor(TicketDao){
        this.TicketDao= TicketDao
    }

    async createTicket(ticket)
    {
        try
        {
            return await this.TicketDao.createTicket(ticket)
        }   
        catch (error)
        {
            return error
        }
    }
}