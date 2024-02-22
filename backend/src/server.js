const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const sequelize = require('./db.js');
const { Umzug, SequelizeStorage } = require('umzug');
const { Sequelize } = require('sequelize');
const cron = require('node-cron');
const cronTasks = require('./tasks/index.js');

const config = require('./config.js');
const logger = require('./logger.js');
const app = express();

// Enable CORS for all routes
app.use(cors());

// Import Routes
const inventoryRoutes = require('./routes/inventory.js');
const shopperRoutes = require('./routes/shopper.js');

// Parse JSON bodies
app.use(express.json());

//Logging
app.use(morgan(config.morganFormat, { stream: logger.httpStream }));

// Mount Routes
app.use('/api/inventory', inventoryRoutes);
app.use('/api/shopper', shopperRoutes);

// Database
(async () => {
  const unzug = new Umzug({
    migrations: { glob: './src/migrations/*.js' },
    context: { queryInterface: sequelize.getQueryInterface(), Sequelize },
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });

  // Run migrations
  try {
    await unzug.up();
    logger.info('All migrations performed successfully');
  } catch (error) {
    logger.error('Error running migrations:', error);
    process.exit(1);
  }

  // Sync models
  try {
    await sequelize.sync();
    logger.info('Database synced successfully');
  } catch (error) {
    logger.error('Error syncing database:', error);
    process.exit(1);
  }
})();

// Set up cron jobs
cron.schedule('0 10 * * 1-5', async () => {
  logger.info('Running daily cron job');
  cronTasks.sendExpirationEmails();
});

// Error handling
app.use((err, req, res) => {
  if (err.name === 'SequelizeValidationError') {
    logger.error('Validation error:', err);
    const errors = err.errors.map((error) => ({
      field: error.path,
      message: error.message,
    }));
    res.status(400).send('Validation errors: ' + JSON.stringify(errors));
  } else {
    logger.error('Unhandled error:', err);
    res.status(500).send('Internal Server Error');
  }
});

//Return Not Found
app.use((req, res) => {
  logger.info('Not found:', req.url);
  res.status(404);
  res.type('text/plain');
  res.send('Not found');
});

module.exports = app;
