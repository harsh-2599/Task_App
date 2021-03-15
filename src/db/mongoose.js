const mongoose = require('mongoose')
const validator = require('validator')
require("dotenv").config()

// CURL is obtained from env file... CURL contains the db link 
const url = process.env.CURL;

mongoose.connect(url,{
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