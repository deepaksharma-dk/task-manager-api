const mongoose = require('mongoose')

mongoose.connect(
    process.env.MONGODB_URL,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    }
).catch(error => {
    console.log(error)
    process.exit(1);
})
