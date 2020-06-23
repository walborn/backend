const jwt = require('jsonwebtoken')
const { secret } = require('../config').jwt


module.exports = (req, res, next) => {
  // if (req.method === 'OPTIONS') return next()

  const access = req.get('Authorization')

  if (!access) res.status(401).json({ message: 'Access token not provided!' })
  
  try {
    jwt.verify(access.replace(/^Bearer /, ''), secret)
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) res.status(401).json({ message: 'Access token expired!' })
    if (e instanceof jwt.JsonWebTokenError) res.status(401).json({ message: 'Invalid access token!' })
  }
  next()
}