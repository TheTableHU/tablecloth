// shopperController.js

const shopperModel = require('../models/shopperModel');
const shopperVisit = require('../models/ShopperVisitModel.js');

const logger = require('../logger.js');

async function getAllShoppers(req, res) {
  try {
    const result = await shopperModel.getAllShoppers();
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

async function checkinShopper(req, res) {
  const Shopper = await shopperModel.getSpecificShopper(req.params.hNumber);
  try {
    if (await shopperVisit.isShopperAtWeekLimit(Shopper.hNumber)) {
      logger.info('Shopper has been twice this week');
      res.status(400).json({ success: false, error: 'Shopper has been twice this week' });
    } else {
      const result = await shopperVisit.createVisit(Shopper.hNumber);
      res.json({ success: true, data: result });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function createShopper(req, res) {
  try {
    const result = await shopperModel.createShopper(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  getAllShoppers,
  checkinShopper,
  createShopper,
};
