//db.js

const { Sequelize } = require('sequelize');
const logger = require('./logger.js');

const dbConfig = require('../config/config.js');

let sequelize;
let sequelizeConnected = false;

async function connectToDatabase() {
  while (!sequelizeConnected) {
    try {
      sequelize = new Sequelize(dbConfig);
      await sequelize.authenticate();
      sequelizeConnected = true;
    } catch (error) {
      logger.error('Unable to connect to the database:', error);
      // Wait for 1 second before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

connectToDatabase();

module.exports = sequelize;
