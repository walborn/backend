const express = require('express')
const mongoose = require ('mongoose')
const cors = require('cors')
const compression = require('compression')
const { env, mongo, port, ip } = require('./config')

const app = express()

mongoose.connect(mongo.uri, { useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true })
mongoose.connection.on('error', (err) => {
  console.log('\x1b[31m%s\x1b[0m', `-- Error -> MongoDB connection to: ${err}`)
  process.exit(-1)
})
mongoose.connection.once('open', () => {
  console.log('\x1b[36m%s\x1b[0m', `-- MongoDB connection to ${mongo.uri} established`)
})

require('./initialize.js')

app.use(cors())
app.use(compression())
app.use(express.json({ extended: true }))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/user', require('./routes/user'))
app.use('/api/master', require('./routes/master'))
app.use('/api/lesson', require('./routes/lesson'))

app.listen(port, () => console.log(
  '%s\x1b[34m%s\x1b[0m%s\x1b[35m%s\x1b[0m%s',
  'Express server listening on ',
  `http://${ip}:${port}`,
  ', in ', env, ' mode')
)


router.post('/signup', bodyParser(), async ctx => {
  const { email, password } = ctx.request.body
  const candidate = await User.findOne({ email })
  if (candidate) return res.status(400).json({ message: 'Such user is already exist'})
  
  const hashedPassword = await bcrypt.hash(password, 12)
  const user = new User({ email, password: hashedPassword })
  await user.save()
  res.status(201).json({ message: 'New user created' })
})


module.exports = app