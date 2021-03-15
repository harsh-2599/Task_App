const express = require('express')
// require('./db/mongoose')
const taskModel = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

// To add a task for a given owner whose details are fetched from auth middleware
router.post('/tasks',auth,async (req,res)=>{
    const task = new taskModel({
        ...req.body, // ... are used to expand object.owner key is added to req.body after it is expanded
        owner : req.user._id
    })
    try {
        await task.save()
        res.status(200).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// 
router.get('/tasks',auth,async (req,res)=>{
    const match = {} // for filtering tasks
    const sort ={} // For sorting task
    
    // when completed is provided in query it moves into if condition, if completed is not provided
    // then it returns all the results as match is empty
    if(req.query.completed){
        // If completed is true then RHS satisfies so match.completed becomes true
        // If completed is false then RHS doesnt satisfy so match.completed becomes false
        match.completed = req.query.completed === 'true'
    }

    // When sortBy parameter is provided in query it moves into if condition else no sorting 
    if(req.query.sortBy){
        // createdAt:desc so when it is split by :, parts[0]= createdAt and parts[1]=desc
        const parts = req.query.sortBy.split(':')
        // So sort[createdAt] = desc denotes that sorting is performed by createdAt with desc order
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    try {
        await req.user.populate({
            path : 'tasks',
            match , // conditions
            options :{
                limit : parseInt(req.query.limit), // How much to show
                skip : parseInt(req.query.skip), // How much to skip at initial
                sort // How to sort
            }
        }).execPopulate()
        res.status(200).send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

// Getting a task by its id
// Middleware is used to know whether the task belongs to th logged in user
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
})

// Update a task by its id
// Middleware is used to know whether the update on task is done by authorized user or not
router.patch('/tasks/:id',auth,async(req,res)=>{
    const id = req.params.id;
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description','completed']
    const isValid = updates.every((update)=> allowedUpdates.includes(update))

    if(!isValid){
        return res.status(400).send("Cant update this/these key/keys")
    }
    try {
        const task = await taskModel.findOne({ _id : id , owner : req.user.id  })
        
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

// Delete task 
// Middleware is used to know whether the task deletion is done by authorized user or not
router.delete('/tasks/:id',auth,async (req,res)=>{
    const id = req.params.id
    try {
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