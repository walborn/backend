const request = require('supertest')
const app = request.agent(require('../app'))
const issueToken = require('./helpers/issueToken')

const authLine = `Bearer ${issueToken({ id: 1 })}`

test('Users list', async () => {
  const res = await app
    .get('/user/list')
    .set('Authorization', authLine);

  expect(res.status).toBe(200)
  expect(Array.isArray(res.body)).toBeTruthy()
})

test('Get user by id should be ok', async () => {
  const res = await app
    .get('/user/item/1')
    .set('Authorization', authLine)

  expect(res.status).toBe(200)
  expect(res.body.email).toBe('user')
})

test('Get user by invalid id should be 404', async () => {
  const res = await app
    .get('/user/item/2020')
    .set('Authorization', authLine)

  expect(res.status).toBe(404)
})
