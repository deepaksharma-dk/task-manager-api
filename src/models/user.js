const mongoose = require('mongoose')
const valiDator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        validate: {
            validator: (v) => valiDator.isEmail(v),
            message: 'Please enter a valid email'
        }
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Please provide a valid email.'],
        validate: [
            {
                validator: (v) => {
                    return valiDator.isLength(v, {min:7})
                },
                message: 'The minimum length of password is 7'
            },
            {
                validator: (v) => {
                    return !valiDator.contains(v, 'password')
                },
                message: 'Please avoid using "password" string in you password'
            }
        ]
    },
    age: {
        type: String,
        trim: true,
        default: 0,
        validate: {
            validator: (v) => valiDator.isInt(v, {gt: 0}),
            message: 'Age should be greater than 0'
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
}

)

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function() {
    let user = this
    let userObj = user.toObject()
    delete userObj.password
    delete userObj.tokens
    delete userObj.avatar

    return userObj
}

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({email})

    if(!user) {
        throw new Error('Invalid credentials')
    }
    
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error('Invalid credentials')
    }
    return user
}
// Hash password
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})
// Delete user tasks when user is removed
userSchema.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({owner: user._id})
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User