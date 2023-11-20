require('dotenv').config()

const path = require('path')
const fs = require('fs')
const crypto = require('crypto')

function projectPath(...bits) {
  return path.join(__dirname, '..', ...bits)
}

module.exports = {
  httpPort: 8081,
  logLevel: 'trace',
  staticDir: projectPath('static'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: 'mysql',
  dbPort: process.env.DB_PORT,
  sessionSecret: 'tablecloth',
}
