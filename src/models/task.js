const mongoose = require('mongoose')
const userModel = require('./user')

const taskSchema = new mongoose.Schema({
    description :{ 
        type : String,
        required : true,
        trim : true
    },
    completed : {
        type : Boolean,
        default : false
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'user'
    }
},{
    timestamps: true
})

const taskModel = mongoose.model('task',taskSchema)

module.exports = taskModel