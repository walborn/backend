const supertest = require('supertest')
const app = require('../app')
const request = supertest(app)


describe('Test the root path', () => {
  test('It should response the GET method', async () => {
    const res = await request.get('/')
    expect(res.statusCode).toBe(200)
  })
})