const express = require('express')
const databaseSetup = require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

// Get the response in req.params.body
app.use(express.json());

// Router settings
app.use(userRouter)
app.use(taskRouter)

app.use(function(req, res) {
    res.status(400).send({error: "error"})
})

databaseSetup().then(msg => {
    app.listen(port, () => {
        console.log('Server is up on port: ' + port)
    })
}).catch(error => {
    console.log('Database Connection error. Please fix it to start server \n\n')
    console.log(error)
})
