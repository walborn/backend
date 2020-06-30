const express = require('express')
const cors = require('cors')
const compression = require('compression')


const app = express()

app.use(cors())
app.use(compression())
app.use(express.json())
// app.use(express.urlencoded({ extended: false }))
app.use('/auth', require('./routes/auth'))
app.use('/user', require('./routes/user'))


module.exports = app


