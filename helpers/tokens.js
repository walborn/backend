const jsonwebtoken = require('jsonwebtoken')
const { v4 } = require('uuid')
const Refresh = require('../model/refresh')
const config = require('../config')


const access = {
  create: ({ uid, expiresIn = config.access.exrpireIn }) => jsonwebtoken.sign({ uid }, config.access.secret, { expiresIn }),
}

const refresh = {
  create: ({ uid, expiresIn = config.refresh.exrpireIn }) => jsonwebtoken.sign({ uid, value: v4() }, config.refresh.secret, { expiresIn }),
  update: async ({ uid, prv, nxt }) => await Refresh
    .findOneAndUpdate({ uid, value: prv }, { uid, value: nxt }, { upsert: true, new: true }),
  remove: async ({ value }) => await Refresh
    .findOneAndRemove({ value }),
  verify: value => jsonwebtoken.verify(value, config.refresh.secret)
}

const pair = async ({ uid, value: prv }) => {
  const nxt = refresh.create({ uid })
  await refresh.update({ uid, prv, nxt })
  return { access: access.create({ uid }), refresh: nxt }
}

module.exports = { access, refresh, pair }