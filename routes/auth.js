// const { Router } = require('express')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const jwtMiddleware = require('koa-jwt')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const uuid = require('uuid/v4')


const User = require('../models/User')
const Refresh = require('../models/Refresh')

const config = require('../config')
const hError = require('../helpers/error')


const router = new Router()


const tokens = async (userId) => {
  const token = jwt.sign({ id: userId }, config.jwtSecret)
  const refresh = uuid()
  await (new Refresh({ refresh, userId })).save(err => err && console.log('Refresh: Error on save!'))
  return { token, refresh }
}

router.post('/signup', bodyParser(), async ctx => {
  const { email, password } = ctx.request.body
  const candidate = await User.findOne({ email })
  if (candidate) return res.status(400).json({ message: 'Such user is already exist'})
  
  const hashedPassword = await bcrypt.hash(password, 12)
  const user = new User({ email, password: hashedPassword })
  
  ctx.body = await user.save() //({ message: 'New user created' })
})


router.post('/signin', bodyParser(), async ctx => {
  const { email, password } = ctx.request.body
  const user = await User.findOne({ email })
  if (!user) return hError(403, 'User not found')
  if (!bcrypt.compare(password, user.password)) return hError(403, 'Password is invalid')
  ctx.body = await tokens(user.id)
})

router.post('/refresh', bodyParser(), async ctx => {
  const { refresh } = ctx.request.body
  const { userId } = await Refresh.findOne({ refresh })
  if (!userId) return

  await Refresh.deleteOne({ userId, refresh })
  ctx.body = await tokens(userId)
})

router.post('/signout', jwtMiddleware({ secret: config.jwtSecret }), async ctx => {
  const { id: userId } = ctx.state.user 
  await Refresh.deleteMany({ userId })
  ctx.body = { success: true }
})

module.exports = router
