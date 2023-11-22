const http = require('http')
const express = require('express')
const morgan = require('morgan')
const expressSession = require('express-session')
const cors = require('cors')
const sequelize = require('./db.js')

const config = require('./config.js')
const logger = require('./logger.js')

const app = express()

// Enable CORS for all routes
app.use(cors())

// Parse JSON bodies
app.use(express.json())

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

//Include routes
const inventoryRoutes = require('./routes/inventory.js')
const shopperRoutes = require('./routes/shopper.js')

//Features
app.use('/api', inventoryRoutes)
app.use('/api', shopperRoutes)

// Database
sequelize
  .sync()
  .then(() => {
    console.log('Database synced successfully')
  })
  .catch(error => {
    console.error('Error syncing database:', error)
  })

//Return Not Found
app.use((req, res) => {
  res.status(404)
  res.type('text/plain')
  res.send('Not found')
})

module.exports = app
