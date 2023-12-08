const { Sequelize } = require('sequelize');

const config = require('./config');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST || 'database',
  port: process.env.DB_PORT || 3306,
  dialect: process.env.DB_DIALECT || 'mysql',
  logging: config.dbLogging,
});

module.exports = sequelize;
