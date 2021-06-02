const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

// Get the response in req.params.body
app.use(express.json());

// Router settings
app.use(userRouter)
app.use(taskRouter)

module.exports = app