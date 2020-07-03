const jwt = require('jsonwebtoken')
const { v4 } = require('uuid')
const Refresh = require('../model/refresh')
const { secret, token } = require('../config').jwt


const access = {
  create: ({ uid, expiresIn = token.access.exrpireIn }) => jwt.sign({ uid }, secret, { expiresIn }),
}

const refresh = {
  create: ({ uid, expiresIn = token.refresh.exrpireIn }) => jwt.sign({ uid, value: v4() }, secret, { expiresIn }),
  update: async ({ uid, prev, next }) => await Refresh
    .findOneAndUpdate({ uid, value: prev }, { uid, value: next }, { upsert: true, new: true }),
  remove: async ({ value }) => await Refresh
    .findOneAndRemove({ value }),
  verify: value => jwt.verify(value, secret)
}

const pair = async ({ uid, value: prev }) => {
  const next = refresh.create({ uid })
  await refresh.update({ uid, prev, next })
  return { access: access.create({ uid }), refresh: next }
}

module.exports = { access, refresh, pair }