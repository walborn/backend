const mongoose = require ('mongoose')
const config = require('./config')
const app = require('./app')


mongoose
  .connect(config.mongo.uri, config.mongo.settings)
  .then(() => app.listen(config.port))