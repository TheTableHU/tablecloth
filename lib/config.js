const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

function projectPath(...bits){
    return path.join(__dirname, '..', ...bits)
}

module.exports = {
    httpPort: 8000,
    logLevel: "trace",
    staticDir: projectPath('static'),
    dbhost: 'localhost',
    dbname: "comp4310",
    sessionSecret: "tablecloth"
}