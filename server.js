require('./mongoose')
const config = require('./config')
const app = require('./app')

if (!module.parent) app.listen(config.port)

// Easily use app.listen(config.port) doesn't work because it starts listening to one port. If you try to write many test files, you'll get an error that says "port in use".
// You want to allow each test file to start a server on their own. To do this, you need to export app without listening to it.
module.exports = app
