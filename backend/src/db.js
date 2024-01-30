const { Sequelize } = require('sequelize');

const dbConfig = require('../config/config.js');

const sequelize = new Sequelize(dbConfig);

module.exports = sequelize;
