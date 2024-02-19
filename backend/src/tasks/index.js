// index.js

// Export all cron tasks from this file
const sendExpirationEmails = require('./sendExpirationEmails.js')

module.exports = {
    sendExpirationEmails
};