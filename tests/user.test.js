const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')

const UserOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: UserOneId,
    name: 'Mike',
    email: 'tim.paulaskas+1@gmail.com',
    password: 'T3st!2482',
    tokens: [{
        token: jwt.sign({ _id: UserOneId}, process.env.JWT_SECRET)
    }]
}

beforeAll(async() => {
    await User.deleteMany()
    await new User(userOne).save()
})

afterAll(async() => {
    await User.deleteMany()
})

test('Should sign up a new user', async() => {
    await request(app).post('/users').send({
        name: 'Tim',
        email: 'tim.paulaskas@gmail.com',
        age: 46,
        password: 'P@ssword!23'
    }).expect(201)
})

test('Should login existing user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
})

test('Should not allow login with bad credentials', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: "Invalid password"
    }).expect(401)
})

test('Should get profile for authenticated user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for authenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})