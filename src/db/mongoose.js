const mongoose = require('mongoose')

const connectDatabase = async () => {
    await mongoose.connect(
        process.env.MONGODB_URL,
        {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
        }
    )
}

module.exports = connectDatabase
