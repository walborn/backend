const express = require('express')
const cors = require('cors')
const compression = require('compression')

const app = express()
app.use(cors())
app.use(compression())
app.use(express.json({ extended: true }))
app.use('/auth', require('./routes/auth2'))
app.use('/user', require('./routes/user2'))

module.exports = app