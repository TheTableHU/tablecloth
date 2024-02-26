// index.js
const cron = require('node-cron');

// Import cron tasks
const sendExpirationEmails = require('./sendExpirationEmails.js');
const shoppersThisWeek = require('./shoppersThisWeek.js');

// Set up cron jobs
async function cronTasks() {
  cron.schedule('0 10 * * 1-5', async () => {
    sendExpirationEmails();
  });

  cron.schedule('0 17 * * 3', async () => {
    shoppersThisWeek();
  });
}

module.exports = cronTasks;
