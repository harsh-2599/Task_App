const express = require('express')
const { ReplSet } = require('mongodb')
// require('./db/mongoose')
const auth = require('../middleware/auth')
const userModel = require('../models/user')

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

router.get('/users/:id',async (req,res)=>{
    const id = req.params.id;
    try {
        const user = await userModel.findById(id)
        if(!user){
            return  res.status(400).send("User not found")
        }
        res.status(200).send(user + "\nUser Displayed")
    } catch (e) {
        res.status(500).send("Error occured\n" + e)
    }
    // userModel.findById(id).then((user)=>{
    //     if(!user){
    //         return res.status(404).send("No data to display")
    //     }
    //     res.status(200).send(user + "\nUser Displayed")
    // }).catch((e)=>{
    //     res.status(500).send("Error occured\n" + e)
    // })
})

router.patch('/users/:id',async(req,res)=>{
    const id = req.params.id;
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','email','age','password']
    const isValid = updates.every((update)=> allowedUpdates.includes(update))

    if(!isValid){
        return res.status(400).send("Cant update this/these key/keys")
    }
    try {
        const user = await userModel.findById(id)
        updates.forEach((update)=> user[update]= req.body[update])
        await user.save()

        // const user = await userModel.findByIdAndUpdate(id,req.body,{new: true, runValidators: true})
        
        if(!user){
            return res.status(404).send("User not found")
        }
        res.status(200).send(user+ "\nUser displayed")
    } catch (e) {
        return res.status(500).send("error occured\n" + e)
    }
})

router.delete('/users/:id', async (req,res)=>{
    const id = req.params.id
    try {
        const user = await userModel.findByIdAndDelete(id)
        if(!user){
            return res.status(404).send("No user found")
        }
        res.status(200).send(user + "\n User deleted")
    } catch (e) {
        res.status(500).send("Error occured\n"+ e)
    }
})

module.exports = router