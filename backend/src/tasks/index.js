// index.js

const cron = require('node-cron');

// Import cron tasks
const sendExpirationEmails = require('./sendExpirationEmails.js');
const shoppersThisWeek = require('./shoppersThisWeek.js');

// Set up cron jobs
// No cron jobs will be run during the summer
async function cronTasks() {
  // Runs from September to December, Monday through Friday at 10 AM
  cron.schedule('0 10 * 9-12 1-5', async () => {
    await sendExpirationEmails();
  }),
    {
      timezone: 'America/Chicago',
    };

  // Runs from January to April, Monday through Friday at 10 AM
  cron.schedule(
    '0 10 * 1-4 1-5',
    async () => {
      await sendExpirationEmails();
    },
    {
      timezone: 'America/Chicago',
    },
  );

  // Runs from January to April on Wednesday at 5 PM
  cron.schedule(
    '0 17 * 1-4 3',
    async () => {
      await shoppersThisWeek();
    },
    {
      timezone: 'America/Chicago',
    },
  );

  // Runs from September to December on Wednesday at 5 PM
  cron.schedule(
    '0 17 * 9-12 3',
    async () => {
      await shoppersThisWeek();
    },
    {
      timezone: 'America/Chicago',
    },
  );
}

module.exports = cronTasks;
