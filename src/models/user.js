const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const task = require('./task')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
            validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid!')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
        if (value < 0) {
                throw new Error('Age must be a positive number!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        trim: true,
        validate(value) {
        if (value.includes('password')) {
            throw new Error('Password cannot contain "password"')
        }
    } 
    },
    tokens: [{
        token: {
            type: String,
            require: true,
        }
    }],
    avatar: {
        type: Buffer
    }
    }
);

UserSchema.virtual('tasks', {
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'owner'
})

UserSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}
UserSchema.methods.authTokenGeneration = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewassignment')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

UserSchema.statics.findByCredentials = async function (email, password)  {
    const user = await this.findOne({ email })
    if (!user) {
        throw new Error('Unable to login')
    } 
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}


// Hash the plain text password before saving
UserSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// Delete user tasks when the user is removed
UserSchema.pre('remove', async function (next) {
    const user = this
    task.deleteMany({owner: user._id})
    next()
})

const user = mongoose.model('users', UserSchema)

module.exports = user