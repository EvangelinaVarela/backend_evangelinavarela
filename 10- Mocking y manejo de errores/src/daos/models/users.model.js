
import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'

const usersSchema = new Schema({
    
        firts_name: {
        type: String,
        index: true
    },
    last_name: String,
    age: Number,
    email: {
        type: String,
        required: true, 
        unique: true
    },
    password: String,
    role:{
        type:String,
        default: 'user'
    },
    cart:{
        type: Schema.Types.ObjectId,
        ref: 'carts'
    }
})


usersSchema.pre('find', function() {
    this.populate('carts')
  })

const usersModel = model('users', usersSchema)

export default usersModel;
