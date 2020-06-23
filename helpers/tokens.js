const jwt = require('jsonwebtoken')
const uuid = require('uuid/v4')
const Refresh = require('../model/refresh')
const { secret, token } = require('../config').jwt


const access = {
  create: ({ uid, expiresIn = token.access.exrpireIn }) => jwt.sign({ uid }, secret, { expiresIn }),
}

const refresh = {
  create: (expiresIn = token.refresh.exrpireIn) => jwt.sign({ id: uuid() }, secret, { expiresIn }),
  update: ({ uid, prv, nxt }) => Refresh
    .findOneAndRemove({ uid, token: prv }).exec()
    .then(() => Refresh.create({ uid, token: nxt })),
  remove: ({ uid, token }) => Refresh
    .findOneAndRemove({ uid, token }).exec(),
  verify: token => jwt.verify(token, secret)
}

const pair = ({ uid, token }) => refresh
  .update({ uid, prv: token, nxt: refresh.create() })
  .then(({ token }) => ({ access: access.create({ uid }), refresh: token }))


module.exports = { access, refresh, pair }