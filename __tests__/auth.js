const request = require('supertest')
const app = request.agent(require('../app'))
const issueToken = require('./helpers/issueToken')

describe('Test the JWT authentification', () => {

  test('User can succesfully login', async () => {
    const res = await app
      .post('/auth/signin')
      .send({ email: 'bgin@inbox.ru', password: 'qweqwe' })

    expect(res.status).toBe(200)
    expect(typeof res.body.token === 'string').toBeTruthy()
    expect(typeof res.body.refresh === 'string').toBeTruthy()

    const refreshRes = await app
      .post('/auth/refresh')
      .send({ refresh: res.body.refresh })
  
    expect(refreshRes.status).toBe(200)
    expect(typeof refreshRes.body.token === 'string').toBeTruthy()
    expect(typeof refreshRes.body.refresh === 'string').toBeTruthy()
  })


  test('User gets 403 on invalid credentials', async () => {
    const res = await app
      .post('/auth/signin')
      .send({ login: 'INVALID',  password: 'INVALID' })
  
    expect(res.status).toBe(403)
  })


  test('User receives 401 on expired token', async () => {
    const expiredToken = issueToken({ id: 1 }, { expiresIn: '1ms' })
    const res = await app
      .get('/user/list')
      .set('Authorization', `Bearer ${expiredToken}`)
  
    expect(res.status).toBe(401)
  })


  test('User can get new access token using refresh token', async () => {
    const res = await app
      .post('/auth/refresh')
      .send({ refresh: 'REFRESH_TOKEN_1' })

    expect(res.status).toBe(200)
    expect(typeof res.body.token === 'string').toBeTruthy()
    expect(typeof res.body.refresh === 'string').toBeTruthy()
  })


  test('User get 404 on invalid refresh token', async () => {
    const res = await app
      .post('/auth/refresh')
      .send({ refresh: 'INVALID_REFRESH_TOKEN' })

    expect(res.status).toBe(404)
  })


  test('User can use refresh token only once', async () => {
    const firstRes = await app
      .post('/auth/refresh')
      .send({ refresh: 'REFRESH_TOKEN_ONCE' })

    expect(firstRes.status).toBe(200)
    expect(typeof firstRes.body.token === 'string').toBeTruthy()
    expect(typeof firstRes.body.refresh === 'string').toBeTruthy()

    const secondRes = await app
      .post('/auth/refresh')
      .send({ refresh: 'REFRESH_TOKEN_ONCE' })

    expect(secondRes.status).toBe(404)
  })


  test('Refresh tokens become invalid on logout', async () => {
    const logoutRes = await app
      .post('/auth/signout')
      .set('Authorization', `Bearer ${issueToken({ id: 2 })}`)

    expect(logoutRes.status).toBe(200)

    const res = await app
      .post('/auth/refresh')
      .send({ refresh: 'REFRESH_TOKEN_TO_DELETE_ON_LOGOUT' })

    expect(res.status).toBe(404)
  })

  
  test('Multiple refresh tokens are valid', async () => {
    const firstSignInRes = await app
      .post('/auth/signin')
      .send({ login: 'user2', password: 'user2' })
    
    const secondSignInRes = await app
      .post('/auth/signin')
      .send({ login: 'user2', password: 'user2' })

    expect(firstSignInRes.status).toBe(200)
    expect(secondSignInRes.status).toBe(200)

    const firstRefreshRes = await app
      .post('/auth/refresh')
      .send({ refresh: firstSignInRes.body.refresh })

    expect(res.status).toBe(200)
    expect(typeof res.body.token === 'string').toBeTruthy()
    expect(typeof res.body.refresh === 'string').toBeTruthy()

    expect(firstRefreshRes.status).toBe(200)
    expect(typeof firstRefreshRes.body.token === 'string').toBeTruthy()
    expect(typeof firstRefreshRes.body.refresh === 'string').toBeTruthy()

    const secondRefreshRes = await app
      .post('/auth/refresh')
      .send({ refresh: secondSignInRes.body.refresh })

    expect(secondRefreshRes.status).toBe(200)
    expect(typeof secondRefreshRes.body.token === 'string').toBeTruthy()
    expect(typeof secondRefreshRes.body.refresh === 'string').toBeTruthy()
  })
})