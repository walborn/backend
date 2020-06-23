const { Schema, model } = require('mongoose')

const schema = new Schema({
  uid: { type: String, required: true },
  token: { type: String, required: true },
})

module.exports = model('Refresh', schema)