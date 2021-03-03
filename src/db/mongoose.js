const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
    useNewUrlParser:true,
    useCreateIndex : true,
    useUnifiedTopology : true,
    useFindAndModify: false
})

// const user = new userModel({
//     name : '  Harsh   ',
//     email : 'harshreddiar25@gmail.com  ',
//     // age : -2
//     age : 21,
//     password : 'Ha1912rsh'
// })

// const task =new taskModel({
    //    description : '    Eat Lunch',
    //     completed : true
// })

// task.save().then((tasks)=>
// console.log(tasks)
// ).catch(()=>
// console.log("error"))


// user.save().then(()=>
// console.log(user)
// ).catch((e)=>
// console.log("Error",e))