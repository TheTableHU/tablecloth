// index.js

const cron = require('node-cron');

// Import cron tasks
const sendExpirationEmails = require('./sendExpirationEmails.js');
const shoppersThisWeek = require('./shoppersThisWeek.js');
const takeSnapshotInventory = require('./takeSnapshotInventory.js');

// Set up cron jobs
async function cronTasks() {
  // Runs Monday through Friday at 10 AM
  cron.schedule('0 10 * * 1-5', async () => {
    await sendExpirationEmails();
  }),
    {
      timezone: 'America/Chicago',
    };

  // Runs on Wednesday at 5 PM
  cron.schedule(
    '0 10 * * 6',
    async () => {
      await shoppersThisWeek();
    },
    {
      timezone: 'America/Chicago',
    },
  );

  // Runs on Wednesday at 10 AM
  cron.schedule(
    '0 10 * * 3',
    async () => {
      await takeSnapshotInventory();
    },
    {
      timezone: 'America/Chicago',
    },
  )
}

module.exports = cronTasks;
