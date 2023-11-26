require('dotenv').config()

const path = require('path')

function projectPath(...bits) {
  return path.join(__dirname, '..', ...bits)
}

module.exports = {
  httpPort: 8081,
  logLevel: 'trace',
  dbLogging: true,
  morganFormat: 'combined',
  staticDir: projectPath('static'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: 'mysql',
  dbPort: process.env.DB_PORT,
  sessionSecret: 'tablecloth',
}
