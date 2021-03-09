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


