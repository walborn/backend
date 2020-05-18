const { resolve } = require('path')
const { reject, find: findEntry } = require('lodash')
const config = require('../config')

// eslint-disable-next-line import/no-dynamic-require
let tokens = require(resolve(__dirname, '..', config.connection, 'refreshTokens'))

const find = async query => findEntry(tokens, query)
const add = async entry => tokens.push(entry)
const remove = async query => { tokens = reject(tokens, query) }

module.exports = {
  find,
  add,
  remove,
}
