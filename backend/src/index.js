const app = require('./server.js')
const http = require('http')
const config = require('./config.js')
const logger = require('./logger.js')

const server = http.createServer(app)

server.listen(config.httpPort, '0.0.0.0', () => {
  logger.info('Server listening on port ' + config.httpPort)
})
