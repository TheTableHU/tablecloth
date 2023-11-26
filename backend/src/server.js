const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const sequelize = require('./db.js')

const config = require('./config.js')
const logger = require('./logger.js')
const app = express()

// Enable CORS for all routes
app.use(cors())

// Import Routes
const inventoryRoutes = require('./routes/inventory.js')
const shopperRoutes = require('./routes/shopper.js')

// Parse JSON bodies
app.use(express.json())

//Logging
app.use(morgan(config.morganFormat, { stream: logger.httpStream }))

// Mount Routes
app.use('/api/inventory', inventoryRoutes)
app.use('/api/shopper', shopperRoutes)

// Database
sequelize
  .sync()
  .then(() => {
    logger.info('Database synced successfully')
  })
  .catch(error => {
    logger.error('Error syncing database:', error)
  })

// Error handling
app.use((err, req, res, next) => {
  if (err.name === 'SequelizeValidationError') {
    logger.error('Validation error:', err)
    const errors = err.errors.map(error => ({
      field: error.path,
      message: error.message,
    }))
    res.status(400).send('Validation errors: ' + JSON.stringify(errors))
  } else {
    logger.error('Unhandled error:', err)
    res.status(500).send('Internal Server Error')
  }
})

//Return Not Found
app.use((req, res, next) => {
  logger.info('Not found:', req.url)
  res.status(404)
  res.type('text/plain')
  res.send('Not found')
})

module.exports = app
