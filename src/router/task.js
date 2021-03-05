const express = require('express')
// require('./db/mongoose')
const taskModel = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks',auth,async (req,res)=>{
    const task = new taskModel({
        ...req.body,
        owner : req.user._id
    })
    try {
        await task.save()
        res.status(200).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
    // task.save().then(()=>{
    //     res.status(200).send(task + "\n Task added")
    // }).catch((e)=>{
    //     res.status(400).send("Error occured \n" + e)
    // })
})

router.get('/tasks',auth,async (req,res)=>{
    const match = {}
    const sort ={}
    
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    try {
        // const tasks = await taskModel.find({owner: req.user._id})
        // res.status(200).send(tasks)
        await req.user.populate({
            path : 'tasks',
            match ,
            options :{
                limit : parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort 
            }
        }).execPopulate()
        res.status(200).send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }
    // taskModel.find({}).then((tasks)=>{
    //     res.status(200).send(tasks+'\n Tasks Displayed ')
    // }).catch((e)=>{
    //     res.status(500).send('Error Occured\n' + e)
    // })
})

router.get('/tasks/:id', auth, async (req,res)=>{
    const id = req.params.id;
    try{

        const task =await taskModel.findOne({ _id : id, owner : req.user._id })
        if(!task){
            return res.status(404).send("No task to display")
        }
        res.status(200).send(task)
    }catch(e){
        res.status(500).send(e)
    }
    // taskModel.findById(id).then((task)=>{
    //     if(!task){
    //         return res.status(404).send("No data to display")
    //     }
    //     res.status(200).send(task + "\nTask Displayed")
    // }).catch((e)=>{
    //     res.status(500).send("Error occured\n" + e)
    // })
})

router.patch('/tasks/:id',auth,async(req,res)=>{
    const id = req.params.id;
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description','completed']
    const isValid = updates.every((update)=> allowedUpdates.includes(update))

    if(!isValid){
        return res.status(400).send("Cant update this/these key/keys")
    }
    try {
        // const task = await taskModel.findById(id)
        const task = await taskModel.findOne({ _id : id , owner : req.user.id  })
        
        // const task = await taskModel.findByIdAndUpdate(id,req.body,{new: true, runValidators: true})
        if(!task){
            return res.status(404).send("Task not found")
        }

        updates.forEach((update)=> task[update]=req.body[update])
        await task.save()
        res.status(200).send(task)
    } catch (e) {
        return res.status(500).send(e)
    }
})

router.delete('/tasks/:id',auth,async (req,res)=>{
    const id = req.params.id
    try {
        // console.log("here")
        // console.log(id)
        // console.log(req.user.id)
        // const task = await taskModel.findByIdAndDelete(id)
        const task = await taskModel.findOneAndDelete({ _id : id , owner : req.user.id })
        if(!task){
            return res.status(404).send("No task found")
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router