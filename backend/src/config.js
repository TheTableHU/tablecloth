require('dotenv').config();

const path = require('path');

function projectPath(...bits) {
  return path.join(__dirname, '..', ...bits);
}

module.exports = {
  httpPort: 8081,
  logLevel: 'trace',
  dbLogging: true,
  morganFormat: 'combined',
  staticDir: projectPath('static'),
};
