const mongoose = require('mongoose')
const validator = require('validator')
const passwordValidator = require('password-validator')

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 30,
        trim: true,
        validate(value) {
            var schema = new passwordValidator()
            schema.is().min(8)
            schema.is().max(30)
            schema.uppercase()
            schema.lowercase()
            schema.symbols()
            schema.digits()
            schema.letters()
            schema.not().spaces()
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain password')
            }
            if (!schema.validate(value)) {
                throw new Error('Password must contain ' + schema.validate(value, { list: true }))
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    }
})

module.exports = User