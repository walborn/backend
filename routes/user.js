const Router = require('koa-router')
const auth = require('../middleware/auth')
const User = require('../models/User')

const router = new Router()

router.get('/list', auth, async ctx => {
  ctx.body = await User.list()
})

router.get('/item/:id', auth, async ctx => {
  const user = await User.findOne({ id: Number(ctx.params.id) })
  if (user) ctx.body = user
})

router.get('/me', auth, async ctx => {
  const user = await User.findOne({ id: Number(ctx.state.user.id) })
  if (user) ctx.body = user
})

module.exports = router




