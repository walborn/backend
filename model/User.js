const { Schema, model } = require('mongoose')

const schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // hash: { type: String, required: true },
  // salt: { type: String, required: true },
  created: { type: Date, default: Date.now },
})

// schema.methods.hash = async password => await bcrypt.hash(password, 12)
// schema.methods.check = async function(password) {
//   return await bcrypt.compare(this.password, password)
// }

// schema.virtual('password')
//   .set(function(password) {
//     this._password = password
//     this.salt = bcrypt.genSaltSync(10)
//     this.hash = bcrypt.hashSync(password, salt)
//   })
//   .get(function() { return this._password })

  module.exports = model('User', schema)