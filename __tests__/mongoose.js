const mongoose = require ('mongoose')
const { mongo } = require('../config')

const supertest = require('supertest')
const request = supertest(require('../app2'))

const User = require('../models/User')
const issueToken = require('./helpers/issueToken')

describe('mongoose connection', () => {

  beforeAll(async done => {
    const url = 'mongodb://127.0.0.1/test'
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    done()
  })

  afterEach(async done => {
    await Object.keys(mongoose.connection.collections).forEach(async (i) => {
      await mongoose.connection.collections[i].deleteMany()
    })
    done()
  })

  afterAll(async done => {
    await mongoose.connection.close()
    done()
  })

  test('adds 1 + 2 to equal 3', (done) => {
    expect(1 + 2).toBe(3)
    done()
  })
  it('Should save user to database', async done => {
    const res = await request.post('/auth/signup').send({
      email: 'testing@gmail.com',
      password: 'testing',
    })
    // Searches the user in the database
    const user = await User.findOne({ email: 'testing@gmail.com' })
    expect(user.email).toBe('testing@gmail.com')
    done()
  })

  test('Users list', async done => {
    const authLine = `Bearer ${issueToken({ id: 1 })}`
    const res = await request
      .get('/user/list')
      .set('Authorization', authLine);
  
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBeTruthy()
    done()
  })
})