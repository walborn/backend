// const mongoose = require ('mongoose')
// const { mongo } = require('./config')

// mongoose.connect(
//   mongo.uri,
//   {
//     useCreateIndex: true,
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
//   },
// )

// mongoose.connection.on('error', (err) => {
//   console.log('\x1b[31m%s\x1b[0m', `-- Error -> MongoDB connection to: ${err}`)
//   process.exit(-1)
// })
// mongoose.connection.once('open', () => {
//   console.log('\x1b[36m%s\x1b[0m', `-- MongoDB connection to ${mongo.uri} established`)
// })