const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase, teardownDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

afterAll(teardownDatabase)

test('Should sign up a new user', async() => {
    const testUser = {
        name: 'Tim',
        email: 'tim.paulaskas@gmail.com',
        age: 46,
        password: 'P@ssword!23'
    }
    const response = await request(app).post('/users').send(testUser).expect(201)

    // Assert that the database was changed correctly
    const dbUser = await User.findById(response.body.user._id)
    expect(dbUser).not.toBeNull()

    //Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: testUser.name,
            email: testUser.email
        },
        token: dbUser.tokens[0].token
    })
    expect(dbUser.password).not.toBe(testUser.password)
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const dbUser = await User.findById(userOneId)
    expect(response.body.token).toBe(dbUser.tokens[1].token)
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

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/Tim-memoji.png')
        .expect(200)

    const dbUser = await User.findById(userOneId)
    expect(dbUser.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid fields for authenticated user', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Bob'
        })
        .expect(200)

    const dbUser = await User.findById(userOneId)
    expect(dbUser.name).toBe('Bob')
})

test('Should not update invalid fields for authenticated user', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'California'
        })
        .expect(400)
})