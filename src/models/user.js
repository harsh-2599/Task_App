const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const taskModel = require('./task')
require("dotenv").config()

const jwtkey = process.env.JWTKEY; // JWTKEY is obtained from env file which is used as key to hash the id

// A schema for user is defined 
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        unique : true,
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
    },
    tokens : [{
        token : {
            type : String,
            required : true
        }
    }],
    avatar : {
        type : Buffer
    }
},{
    timestamps : true
})

// Function for schema is added... Function runs when login is performed
// Static is used directly on model
userSchema.statics.findByCredentials = async (email,password) => {
    const user = await userModel.findOne({email})
    if(!user){
        throw new Error("No user found for this email")
    }
    // Password is decrypted then compared.. If matched, it is 1 else 0
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new mongoose.Error("Unable to login password doesnt match")
    }
    return user
}

// Foreign fields are set using virtual setters
userSchema.virtual('tasks',{
    ref : 'task', // reference schema is task
    localField : '_id', // Here field is _id
    foreignField : 'owner' // In task schema owner field's value should be _id
})

// Token generation function
// Method is used on instance pf a model 
userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id : user._id.toString()},jwtkey) // user id is hashed using secret key
    // console.log(token);
    user.tokens = user.tokens.concat({token}) // Token is added into array 
    // console.log(user.tokens);
    await user.save()
    return token
}

// Whenever toJSON methos is used this function is called... Used to display user's info so password, tokens and avatar are deleted from object
userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject();
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

// THe below function runs before(pre) any save is performed... This performs encryption of password
userSchema.pre('save',async function (next){
    const user =this
    
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8) // 8 denotes that 8 rounds are done
    }
    next()
})

// THe below function runs before(pre) any remove is performed
userSchema.pre('remove',async function(next){
    const user = this
    await taskModel.deleteMany({owner : user._id})
    next()
})

// Schema is used as for model
const userModel = mongoose.model('user',userSchema)

module.exports = userModel