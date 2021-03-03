const mongoose = require('mongoose')


const taskModel = mongoose.model('task',{
    description :{ 
        type : String,
        required : true,
        trim : true
    },
    completed : {
        type : Boolean,
        default : false
    }
})

module.exports = taskModel