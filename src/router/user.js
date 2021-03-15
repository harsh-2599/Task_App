const express = require('express')
const { ReplSet } = require('mongodb')
// require('./db/mongoose')
const auth = require('../middleware/auth')
const userModel = require('../models/user')
const multer = require('multer')
const { Error } = require('mongoose')
const sharp = require('sharp')
const sendEmail = require("./../utils/sendEmail");

const router = new express.Router() // For routes

// Route for creating new users
router.post('/users',async (req,res)=>{
    const user = new userModel(req.body)
    //Using async await
    try {
        // await user.save()
        const token = await user.generateAuthToken() // Generating token for users
        sendEmail(req.body.email,`<b><i> Welcome ${req.body.name}</i></b>`); // Sending welcome mail
        res.status(201).send({user, token}) // Returns user data and token
    } catch (e) {
        res.status(400).send("Error occured\n" + e)
    }
})

// Route for login of users
router.post('/users/login',async (req,res)=>{
    try {
        const user = await userModel.findByCredentials(req.body.email,req.body.password) // Matching email and password provided with the db
        const token = await user.generateAuthToken() // Generating token when user login 
        res.status(200).send({user,token}) // Returns user data and token
    } catch (e) {
        res.status(500).send({error:e.message})
    }
})

// Route for logging out of users
// Middleware is provided which ensures that the authenticated user wants to perform logout
router.post('/users/logout', auth, async (req,res)=>{
    try {
        // The token except the one in use are stored and the remaining is discarded.
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token != req.token
        })
        await req.user.save()
        res.status(200).send("Logout successful")
    } catch (e) {
        res.status(500).send({Error : e.message})
    }
})

// Route for logging out of users from everywhere
// Middleware is provided which ensures that the authenticated user wants to perform logout
router.post('/users/logoutall',auth, async (req,res)=>{
    try {
        req.user.tokens = [] // tokens array is assigned as empty
        await req.user.save();
        res.status(200).send("Logged out of all accounts")
    } catch (e) {
        res.status(500).send({Error : e.message})
    }
})

// Route for displaying profile for user
// Middleware is used here to know which user is trying to display his own profile
router.get('/users/me',auth,async (req,res)=>{
    res.send(req.user)
})

// Route for updating profile for user
// Middleware is used to find whether the authenticated user is trying to update the profile
router.patch('/users/me',auth,async(req,res)=>{
    const updates = Object.keys(req.body) // Gets keys form the object passed in request
    const allowedUpdates = ['name','email','age','password']
    // Checks whether the update is allowable or not
    const isValid = updates.every((update)=> allowedUpdates.includes(update)) 

    if(!isValid){
        return res.status(400).send("Cant update this/these key/keys")
    }
    try {
        updates.forEach((update)=> req.user[update]= req.body[update])
        await req.user.save()
        res.status(200).send(req.user)
    } catch (e) {
        return res.status(500).send("error occured\n" + e)
    }
})

// Route for deleting user account
// Middleware is used to authenticate the user who wants to delete account 
router.delete('/users/me', auth ,async (req,res)=>{
    try {
        sendEmail(req.user.email,`<b><i> Thank You. Goodbye ${req.user.name}</i></b>`); // Sending goodbye mail
        await req.user.remove();
        res.status(200).send( req.user)
    } catch (e) {
        res.status(500).send("Error occured\n"+ e)
    }
})

// For image upload as profile photo. Multer library is used
const upload = multer({
    limits:{
        fileSize : 2500000 // File size is limited to 2.5MB
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)/)){ // Supported extensions
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})

// Upload a avatar for an account
// Middleware is used for authenticating the user
router.post('/users/avatar/upload' , auth , upload.single('avatar') , async (req,res)=>{
    // Using sharp library fetching the image in buffer, resizing it and changing extension
    const buffer = await sharp(req.file.buffer).resize({width : 250, height : 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send('Avatar Added Successfully')
},(err,req,res,next)=>{
    res.status(400).send({error : error.message})
})

// For displaying avatar of user
router.get('/users/avatar/display',auth, async(req,res)=>{
    try {
        const id = req.user._id
        const user = await userModel.findById(id)

        if(!user || !user.avatar){
            throw new Error('Not found for this ID')
        }
        res.set('Content-type','image/png') // Setting content type of response to image/png
        res.send(user.avatar)
    } catch (e) {
        res.status(400).send(e)
    }
})

// For deleting avatar of user 
router.delete('/users/me/avatar', auth , async (req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send('Avatar Deleted Successfully')
})
module.exports = router