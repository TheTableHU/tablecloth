const mailerPromise = require('../mailer.js');
const { models } = require('../models/index.js');
const logger = require('../logger.js');
const Shopper = models.Shopper;
const ShopperVisits = models.ShopperVisit;
const { Op } = require('sequelize'); // Import Sequelize operators

async function shoppersThisWeek() {
  const mailer = await mailerPromise;
  const today = new Date();

  // Find the last complete week
  const dayOfWeek = today.getDay(); 
  let lastFriday = new Date(today);
  let lastMonday = new Date(today);

  if (dayOfWeek === 0 || dayOfWeek === 6) {
    const daysSinceMonday = (dayOfWeek + 6) % 7;
    lastFriday.setDate(today.getDate() - daysSinceMonday + 4);
    lastMonday.setDate(today.getDate() - daysSinceMonday);
  } else {
    const daysSinceMonday = (dayOfWeek + 6) % 7;
    lastFriday.setDate(today.getDate() - daysSinceMonday - 3);
    lastMonday.setDate(today.getDate() - daysSinceMonday - 7); 
  }

  lastFriday.setHours(23, 59, 59, 999);
  lastMonday.setHours(0, 0, 0, 0);


  // Store the last week in string format
  const weekString = `Monday ${lastMonday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - Friday ${lastFriday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

  // Determine if we are in fall or spring
  const year = today.getFullYear();
  const month = today.getMonth();
  let isFall = false;
  let fall, spring;

  if (month > 7 && month <= 11) {
    fall = new Date(`${year}-08-01`);
    spring = new Date(`${year + 1}-01-01`);
    isFall = true;
  } else {
    fall = new Date(`${year - 1}-08-01`);
    spring = new Date(`${year}-01-01`);
  }

  // Fetch data for the last completed week
  const newShoppersThisWeek = await Shopper.count({
    where: {
      dateRegistered: {
        [Op.gte]: lastMonday,
        [Op.lte]: lastFriday,
      },
    },
  });

  const shopperVisitsThisWeek = await ShopperVisits.count({
    where: {
      visitTime: {
        [Op.gte]: lastMonday,
        [Op.lte]: lastFriday,
      },
    },
  });

  // Fetch data for the current semester
  const totalNewShoppersThisSemester = await Shopper.count({
    where: {
      dateRegistered: {
        [Op.gte]: isFall ? fall : spring,
        [Op.lte]: today,
      },
    },
  });

  const totalShopperVisitsThisSemester = await ShopperVisits.count({
    where: {
      visitTime: {
        [Op.gte]: isFall ? fall : spring,
        [Op.lte]: today,
      },
    },
  });

  // Fetch data for the previous week
  const lastWeekMonday = new Date(lastMonday);
  lastWeekMonday.setDate(lastMonday.getDate() - 7);
  const lastWeekFriday = new Date(lastFriday);
  lastWeekFriday.setDate(lastFriday.getDate() - 7);

  const totalNewShoppersWeekBefore = await Shopper.count({
    where: {
      dateRegistered: {
        [Op.gte]: lastWeekMonday,
        [Op.lte]: lastWeekFriday,
      },
    },
  });

  const totalShopperVisitsWeekBefore = await ShopperVisits.count({
    where: {
      visitTime: {
        [Op.gte]: lastWeekMonday,
        [Op.lte]: lastWeekFriday,
      },
    },
  });

  // Calculate percentage growth for visits and new shoppers
  const percentageGrowthWeekVisits = totalShopperVisitsWeekBefore
    ? ((shopperVisitsThisWeek - totalShopperVisitsWeekBefore) / totalShopperVisitsWeekBefore) * 100
    : 0;

  const percentageGrowthShoppersWeek = totalNewShoppersWeekBefore
    ? ((newShoppersThisWeek - totalNewShoppersWeekBefore) / totalNewShoppersWeekBefore) * 100
    : 0;

  const signWeeklyVisits = percentageGrowthWeekVisits > 0 ? "+" : "";
  const signNewShoppers = percentageGrowthShoppersWeek > 0 ? "+" : "";

  // Fetch overall data
  const totalShopperVisitsOverall = await ShopperVisits.count(); // Overall visits
  const totalShoppersOverall = await Shopper.count(); // Overall shoppers

  // Skip email if no new data
  if (newShoppersThisWeek === 0 && shopperVisitsThisWeek === 0) {
    logger.info('No new shoppers or visits this week. Skipping email');
    return;
  }

  // Send the email
  await mailer.sendMail({
    from: process.env.EMAIL,
    to: process.env.NODE_ENV === 'production' ? process.env.PROD_EMAIL : process.env.TEST_EMAIL,
    subject: 'Shopper Report TheTableHU',
    template: 'shoppers_report',
    context: {
      signWeeklyVisits,
      percentageGrowthShoppersWeek: percentageGrowthShoppersWeek.toFixed(2),
      percentageGrowthWeekVisits: percentageGrowthWeekVisits.toFixed(2),
      signNewShoppers,
      totalShopperVisitsThisSemester,
      totalShopperVisitsOverall,
      totalShoppersOverall,
      shopperVisitsThisWeek,
      newShoppersThisWeek,
      totalNewShoppersThisSemester,
      weekString
    }
  });
}
module.exports = shoppersThisWeek;
