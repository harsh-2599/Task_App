const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const taskModel = require('./task')

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

userSchema.statics.findByCredentials = async (email,password) => {
    const user = await userModel.findOne({email})
    if(!user){
        throw new Error("No user found for this email")
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new mongoose.Error("Unable to login password doesnt match")
    }
    return user
}

userSchema.virtual('tasks',{
    ref : 'task',
    localField : '_id',
    foreignField : 'owner'
})

userSchema.methods.generateAuthToken = async function(){
    // console.log("Ib function")
    const user = this
    const token = jwt.sign({_id : user._id.toString()},'thisisharshreddiar')
    // console.log(token);
    user.tokens = user.tokens.concat({token})
    // console.log(user.tokens);
    await user.save()
    return token
}

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject();
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.pre('save',async function (next){
    const user =this
    
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

userSchema.pre('remove',async function(next){
    const user = this
    await taskModel.deleteMany({owner : user._id})
    next()
})

const userModel = mongoose.model('user',userSchema)

module.exports = userModel