const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')

const userOne = {
    name: 'Mike',
    email: 'tim.paulaskas+1@gmail.com',
    password: 'T3st!2482'
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