// const { Router } = require('express')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const jwtMiddleware = require('koa-jwt')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const uuid = require('uuid/v4')


const User = require('../models/User')
const Refresh = require('../models/Refresh')

const config = require('../../config')


const router = new Router()


const tokens = async (userId) => {
  const token = jwt.sign({ id: userId }, config.secret)
  const refresh = uuid()
  await Refresh.add({ refresh, userId })
  return { token, refresh }
}

const handleError = (status, message) => {
  const error = new Error()
  error.status = status
  error.message = message
  throw error
}

router.post('/signin', bodyParser(), async ctx => {
  const { email, password } = ctx.request.body
  const user = await User.findOne({ email })
  if (!user) return handleError(403, 'User not found')
  if (!bcrypt.compare(password, user.password)) return handleError(403, 'Password is invalid')
  ctx.body = await tokens(user.id)
})

router.post('/refresh', bodyParser(), async ctx => {
  const { refresh } = ctx.request.body
  const { userId } = await Refresh.findOne({ refresh })
  if (!userId) return

  await Refresh.remove({ token: refresh })
  ctx.body = await tokens(userId)
})

router.post('/signout', jwtMiddleware({ secret: config.jwtSecret }), async ctx => {
  const { id: userId } = ctx.state.user 
  await Refrash.remove({ userId })
  ctx.body = { success: true }
})

module.exports = router
