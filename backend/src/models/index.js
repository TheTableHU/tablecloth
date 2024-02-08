'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const sequelize = require('../db.js');
const logger = require('../logger.js');
let db = {};

// Read all model files dynamically
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);

    try {
      if (model && model.prototype instanceof Sequelize.Model) {
        db[model.name] = model;
      } else {
        logger.error(`Model file ${file} does not export a valid model`);
      }
    } catch (error) {
      logger.error(`Error loading model file ${file}: ${error.message}`);
    }
  });

// Define associations
try {
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
} catch (error) {
  logger.error('Error associating models: ' + error.message);
}

// Export the models individually
const models = db;

module.exports = {
  sequelize,
  models,
};
