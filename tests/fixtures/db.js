const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'tim.paulaskas+1@gmail.com',
    password: 'T3st!2482',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Tim',
    email: 'tim.paulaskas+2@gmail.com',
    password: 'T3st!2482',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: mongoose.Types.ObjectId(),
    description: 'First task for userOne',
    completed: false,
    owner: userOne._id
}

const taskTwo = {
    _id: mongoose.Types.ObjectId(),
    description: 'Second task for userOne',
    completed: false,
    owner: userOne._id
}

const taskThree = {
    _id: mongoose.Types.ObjectId(),
    description: 'First task for userTwo',
    completed: false,
    owner: userTwo._id
}


const setupDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

const teardownDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
}

module.exports = {
    setupDatabase,
    teardownDatabase,
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree
}