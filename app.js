const express = require('express')
const cors = require('cors')
const compression = require('compression')
const bodyParser = require('body-parser')
const jwtMiddleware = require('express-jwt')
const { secret } = require('./config').jwt


const app = express()

app.use(cors())
app.use(compression())
app.use(bodyParser.json())
// app.use(express.json({ extended: true }))
app.use('/auth', require('./routes/auth'))
app.use(jwtMiddleware({ secret }))
app.use('/user', require('./routes/user'))


module.exports = app