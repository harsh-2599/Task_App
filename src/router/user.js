const express = require('express')
// require('./db/mongoose')
const userModel = require('../models/user')

const router = new express.Router()

router.post('/users',async (req,res)=>{
    const user = new userModel(req.body)

    //Using async await
    try {
        await user.save()
        res.status(201).send(user + '\n User added')
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

router.get('/users',async (req,res)=>{

    try {
        const users =  await userModel.find({})
        res.status(200).send(users +"\n Displayed user")
    } catch (e) {
        res.status(500).send('Error Occured\n' + e)
    }
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
        const user = await userModel.findByIdAndUpdate(id,req.body,{new: true, runValidators: true})
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