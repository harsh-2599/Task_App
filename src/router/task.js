const express = require('express')
// require('./db/mongoose')
const taskModel = require('../models/task')

const router = new express.Router()

router.post('/tasks',async (req,res)=>{
    const task = new taskModel(req.body)
    try {
        await task.save()
        res.status(200).send(task + "\n Task added")
    } catch (e) {
        res.status(400).send("Error occured \n" + e)
    }
    // task.save().then(()=>{
    //     res.status(200).send(task + "\n Task added")
    // }).catch((e)=>{
    //     res.status(400).send("Error occured \n" + e)
    // })
})

router.get('/tasks',async (req,res)=>{
    try {
        task = await taskModel.find({})
        res.status(200).send(task+'\n Tasks Displayed ')
    } catch (e) {
        res.status(500).send('Error Occured\n' + e)
    }
    // taskModel.find({}).then((tasks)=>{
    //     res.status(200).send(tasks+'\n Tasks Displayed ')
    // }).catch((e)=>{
    //     res.status(500).send('Error Occured\n' + e)
    // })
})

router.get('/tasks/:id',async (req,res)=>{
    const id = req.params.id;
    try{
        task = await taskModel.findById(id)
        if(!task){
            return res.status(404).send("No task to display")
        }
        res.status(200).send(task + "\nTask Displayed")
    }catch(e){
        res.status(500).send("Error occured\n" + e)
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

router.patch('/tasks/:id',async(req,res)=>{
    const id = req.params.id;
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description','completed']
    const isValid = updates.every((update)=> allowedUpdates.includes(update))

    if(!isValid){
        return res.status(400).send("Cant update this/these key/keys")
    }
    try {
        const task = await taskModel.findByIdAndUpdate(id,req.body,{new: true, runValidators: true})
        if(!task){
            return res.status(404).send("Task not found")
        }
        res.status(200).send(task+ "\nTask displayed")
    } catch (e) {
        return res.status(500).send("error occured\n" + e)
    }
})

router.delete('/tasks/:id', async (req,res)=>{
    const id = req.params.id
    try {
        const task = await taskModel.findByIdAndDelete(id)
        if(!task){
            return res.status(404).send("No task found")
        }
        res.status(200).send(task + "\n Task deleted")
    } catch (e) {
        res.status(500).send("Error occured\n"+ e)
    }
})

module.exports = router