const mailer = require('../mailer.js');
const { models } = require('../models/index.js');
const logger = require('../logger.js');

const Shopper = models.Shopper;
const ShopperVisits = models.ShopperVisit;

async function shoppersThisWeek() {
  // Get new registered shoppers for this week
  const newShoppers = await Shopper.newShoppersThisWeek();

  // Get the total number of shopper visits this week
  const totalVisits = await ShopperVisits.shopperVisitsThisWeek();

  // Get the number of shoppers overall
  const totalShoppers = await ShopperVisits.count();

  if (newShoppers === 0 && totalVisits === 0) {
    logger.info('No new shoppers or visits this week. Skipping email');
    return;
  }

  // Send emails here
  await mailer.sendMail({
    from: process.env.EMAIL,
    to: process.env.NODE_ENV === 'production' ? process.env.PROD_EMAIL : process.env.TEST_EMAIL,
    subject: 'Weekly Shopper Report',
    text: `New shoppers this week: ${newShoppers}\nTotal visits this week: ${totalVisits}\nTotal amount of visits overall: ${totalShoppers}`,
    html: `<p>New shoppers this week: ${newShoppers}<br>Total visits this week: ${totalVisits}<br>Total amount of visits overall: ${totalShoppers}</p>`,
  });
}

module.exports = shoppersThisWeek;
