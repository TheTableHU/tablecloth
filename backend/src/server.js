const express = require('express');
const cors = require('cors');
const { Umzug, SequelizeStorage } = require('umzug');
const { Sequelize } = require('sequelize');
const moment = require('moment-timezone');

const sequelize = require('./db.js');
const cronTasks = require('./tasks/index.js');
const logger = require('./logger.js');

const app = express();

// Logging - this event will run once the request is done
app.use((req, res, next) => {
  res.on('finish', () => {
    const timestamp = moment().tz('America/Chicago').format('M/D/YYYY, HH:mm:ss');
    const { method, originalUrl } = req;
    const { statusCode } = res;

    const message = `${timestamp} ${method} ${originalUrl} ${statusCode}`;

    logger.http(message);
  });
  next();
});



// Enable CORS for all routes
app.use(cors());

// Import Routes
const inventoryRoutes = require('./routes/inventory.js');
const shopperRoutes = require('./routes/shopper.js');
const loginRoutes = require("./routes/login.js");
const userRoutes = require("./routes/users.js");
const { checkCredentials, requireVolunteerPermissions, requireWorkerPermissions, requireAdminPermissions } = require('./checkCredentials.js');

// Parse JSON bodies
app.use(express.json());

// Mount Routes
app.use('/api/inventory', checkCredentials, requireWorkerPermissions ,inventoryRoutes);
app.use('/api/shopper', checkCredentials, requireVolunteerPermissions, shopperRoutes);
app.use('/api/login', loginRoutes );
app.use('/api/users', checkCredentials, requireAdminPermissions, userRoutes);

// Database
(async () => {
  const umzug = new Umzug({
    migrations: { glob: './src/migrations/*.js' }, // Fixed typo here
    context: { queryInterface: sequelize.getQueryInterface(), Sequelize },
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });

  // // Run migrations
  // try {
  //   await umzug.up();  // Fixed typo here
  //   logger.info('All migrations performed successfully');
  // } catch (error) {
  //   logger.error('Error running migrations:', error);
  //   process.exit(1);
  // }

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
cronTasks();

// Error handling
app.use((err, req, res, next) => {  // Added 'next' for error handling middleware
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

// Return Not Found
app.use((req, res) => {
  logger.info('Not found:', req.url);
  res.status(404);
  res.type('text/plain');
  res.send('Not found');
});

module.exports = app;
