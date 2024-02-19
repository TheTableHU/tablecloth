const logger = require('../logger.js');
const mailer = require('../mailer.js');
const { models } = require('../models/index.js');
const ExpirationDates = models.ExpirationDates;

async function sendExpirationEmails() {
    logger.info('Sending expiration emails...');
    
    // Get expired items from the database and see if they are two weeks from expiration and an email hasn't been sent
    const items = await ExpirationDates.getTwoWeeksExpirationDates();

    if (items.length === 0) {
        logger.info('No items to send expiration emails for. Exiting...');
        return;
    }

    const itemNamesAndDates = items.map(item => {
        item.betterDate = new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
        return `${item.Inventory.item}: ${item.betterDate}`;
    }).join('\n');

    // Send emails here
    await mailer.sendMail({
        from: process.env.EMAIL,
        to: "thetable@harding.edu",
        subject: "Items are about to expire!",
        text: `The following items are about to expire:\n${itemNamesAndDates}`,
        html: `<p>The following items are about to expire:<br>${itemNamesAndDates.replace(/\n/g, '<br>')}</p>`,
    });

    logger.info('Expiration emails sent!');

    await ExpirationDates.updateNotificationSent(items.map(item => item.id));
}

module.exports = sendExpirationEmails;
