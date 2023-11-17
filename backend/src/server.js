const http = require('http')
const express = require('express')
const morgan = require('morgan')
const expressSession = require('express-session')
const cors = require('cors')

const config = require('./config.js')
//const db = require("./db.js");
const logger = require('./logger.js')

//Include routes
const inventoryRoutes = require('./routes/inventory.js')

const app = express()

// Enable CORS for all routes
app.use(cors())

//Logging
app.use(morgan(config.morganFormat, { stream: logger.httpStream }))

//Session
app.use(
  expressSession({
    secret: config.sessionSecret,
    saveUninitialized: false,
    resave: false,
  })
)

//Features
app.use('/api', inventoryRoutes)

//Last effort to try to find a file to serve

//Return Not Found
app.use((req, res) => {
  res.status(404)
  res.type('text/plain')
  res.send('Not found')
})

module.exports = app

const server = http.createServer(app)

server.listen(config.httpPort, () => {
  logger.info('Server listening on port ' + config.httpPort)
})
