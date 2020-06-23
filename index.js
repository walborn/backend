const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require ('mongoose')
const { secret } = require('./config').jwt

const app = express()
app.use(bodyParser.json())

app.use(express.json({ extended: true }))
app.use('/auth', require('./routes/auth'))
app.use(jwtMiddleware({ secret }))
app.use('/user', require('./routes/user'))


mongoose
  .connect(config.mongo.uri, config.mongo.settings)
  .then(() => app.listen(config.port))
  .catch(err => console.error(`Error connecting to mongo: ${config.mongo.uri}`, err))