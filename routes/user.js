const Router = require('koa-router')
const User = require('../models/User')

const hError = require('../helpers/error')

const router = new Router()

router.get('/list', async ctx => {
  ctx.body = await User.find({})
})

router.get('/item/:id', async ctx => {
  const user = await User.findOne({ _id: ctx.params.id })
  if (!user) return hError(403, 'User not found')
  ctx.body = user
})

router.get('/me', async ctx => {
  const user = await User.findOne({ _id: ctx.state.user.id })
  if (!user) return hError(403, 'Me not found')
  ctx.body = user
})

module.exports = router




