const express = require('express')
const cors = require('cors')
const compression = require('compression')

const jwtMiddleware = require('express-jwt')

const config = require('./config')

const koa = new Koa()
const router = new Router()
router.get('/', ctx => { ctx.body = 'ok' })
router.use('/auth', require('./routes/auth').routes())
router.use(jwtMiddleware({ secret: config.jwtSecret }))
router.use('/user', require('./routes/user').routes())

koa.use(router.allowedMethods())
koa.use(router.routes())

const app = express()
app.use(cors())
app.use(compression())
app.use(express.json({ extended: true }))
app.use('/auth', require('./routes/auth'))
app.use('/user', require('./routes/user'))


module.exports = koa
