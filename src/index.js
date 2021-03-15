const express = require('express')
require('./db/mongoose')
const userRouter = require('./router/user')
const taskRouter = require('./router/task')

const app = express() //Starting an application
const port = process.env.PORT || 3000 // Port is assigned... Default 3000 is considered

app.use(express.json()) // The incoming request is recognized as json object
app.use(userRouter) // userRouter is used in app
app.use(taskRouter) // taskRouter is used in app

// App is connected to specified port
app.listen(port,()=>{
    console.log("Server is started on port "+ port);
    
})
