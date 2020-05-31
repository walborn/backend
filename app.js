const Koa = require('koa')
const Router = require('koa-router')
const jwtMiddleware = require('koa-jwt')

const config = require('./config')

const koa = new Koa()
const router = new Router()
router.get('/', ctx => { ctx.body = 'ok' })
router.use('/auth', require('./routes/auth').routes())
router.use(jwtMiddleware({ secret: config.jwtSecret }))
router.use('/user', require('./routes/user').routes())

koa.use(router.allowedMethods())
koa.use(router.routes())

module.exports = koa
