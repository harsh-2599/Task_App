const express = require('express')
require('./db/mongoose')
const userModel = require('./models/user')
const taskModel = require('./models/task')
const { findByIdAndUpdate } = require('./models/user')
const userRouter = require('./router/user')
const taskRouter = require('./router/task')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port,()=>{
    console.log("Server is started on port "+ port);
})


const main = async ()=>{
    // const task = await taskModel.findById('6041d1b562209130c84a790c')
    // await task.populate('owner').execPopulate()
    // console.log (task.owner)

    const user = await userModel.findById('6041d17e16ed7f4498a194a3')
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
}

// main()