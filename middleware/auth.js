const expressJwt = require('express-jwt')
const config = require('../config')


module.exports = [
  expressJwt({ secret: config.access.secret, algorithms: [ 'HS256' ] }),
  (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') res.status(err.status).send(err)
    next()
  }
]