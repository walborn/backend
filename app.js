const express = require('express')
const cors = require('cors')


const app = express()

app.use(cors())
app.use(express.json())
app.use('/auth', require('./routes/auth'))
app.use('/user', require('./routes/user'))


module.exports = app


