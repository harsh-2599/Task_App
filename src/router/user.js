const express = require('express')
const { ReplSet } = require('mongodb')
// require('./db/mongoose')
const auth = require('../middleware/auth')
const userModel = require('../models/user')
const multer = require('multer')
const { Error } = require('mongoose')
const sharp = require('sharp')

const router = new express.Router()

router.post('/users',async (req,res)=>{
    const user = new userModel(req.body)

    //Using async await
    try {
        // await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send("Error occured\n" + e)
    }

    //using then catch
    // user.save().then(()=>{
    //     res.status(200).send(user + "\n User added")
    // }).catch((e)=>{
    //     res.status(400).send("Error occured\n" + e)
    // })
})

router.post('/users/login',async (req,res)=>{
    try {
        const user = await userModel.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({user,token})
    } catch (e) {
        res.status(500).send({error:e.message})
    }
})

router.post('/users/logout', auth, async (req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token != req.token
        })
        await req.user.save()
        res.status(200).send("Logout successful")
    } catch (e) {
        res.status(500).send({Error : e.message})
    }
})

router.post('/users/logoutall',auth, async (req,res)=>{
    try {
        req.user.tokens = []
        await req.user.save();
        res.status(200).send("Logged out of all accounts")
    } catch (e) {
        res.status(500).send({Error : e.message})
    }
})

router.get('/users/me',auth,async (req,res)=>{
    res.send(req.user)
    // userModel.find({}).then((users)=>{
    //     res.status(200).send(users+'\n Users Displayed ')
    // }).catch((e)=>{
    //     res.status(500).send('Error Occured\n' + e)
    // })
})

router.patch('/users/me',auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','email','age','password']
    const isValid = updates.every((update)=> allowedUpdates.includes(update))

    if(!isValid){
        return res.status(400).send("Cant update this/these key/keys")
    }
    try {
        // const user = await userModel.findById(id)
        updates.forEach((update)=> req.user[update]= req.body[update])
        await req.user.save()
        res.status(200).send(req.user)
    } catch (e) {
        return res.status(500).send("error occured\n" + e)
    }
})

router.delete('/users/me', auth ,async (req,res)=>{
    try {
        await req.user.remove()
        res.status(200).send( req.user)
    } catch (e) {
        res.status(500).send("Error occured\n"+ e)
    }
})

const upload = multer({
    limits:{
        fileSize : 2500000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)/)){
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar' , auth , upload.single('avatar') , async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width : 250, height : 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send('Avatar Added Successfully')
},(err,req,res,next)=>{
    res.status(400).send({error : error.message})
})

router.get('/users/:id/avatar', async(req,res)=>{
    try {
        const id = req.params.id
        const user = await userModel.findById(id)

        if(!user || !user.avatar){
            throw new Error('Not found for this ID')
        }
        res.set('Content-type','image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me/avatar', auth , async (req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send('Avatar Deleted Successfully')
})
module.exports = router