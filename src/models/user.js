const mongoose = require('mongoose')
const validator = require('validator')

const userModel = mongoose.model('user',{
    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        toLowerCase : true,
        trim : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is not valid')
            }
        }
    },
    age :{
        type : Number,
        default : 0,
        validate(value){
            if(value < 0){
                throw new Error('Age must be a positive number')
            }
        }
    },
    password : {
        type : String,
        required : true,
        trim : true,
        minlength : 7,
        validate(value){
            if(value.toLowerCase().includes("password")){
                throw new Error('Password cannot be  ' + value);
            }
        }
    }
})


module.exports = userModel