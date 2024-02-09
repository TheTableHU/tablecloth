// shopperController.js

const { models } = require('../models/index.js');

const shopperModel = models.Shopper;
const shopperVisit = models.ShopperVisit;

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

  if (!Shopper) {
    res.status(400).json({ success: false, error: 'ShopperNotFound' });
    return;
  }

  try {
    if (await shopperVisit.isShopperAtWeekLimit(Shopper.hNumber)) {
      logger.warn('Shopper has been twice this week');
      res.status(400).json({ success: false, error: 'ShopperBeenTwiceThisWeek' });
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
  if (
    typeof req.body.formData.hNumber !== 'string' ||
    !req.body.formData.hNumber.match(/^[0-9]{8}$/)
  ) {
    res.status(400).json({ success: false, error: 'InvalidHNumber' });
    return;
  }

  try {
    const result = await shopperModel.createShopper(req.body);

    if (result === null) {
      res.status(400).json({ success: false, error: 'ShopperAlreadyExists' });
    } else {
      res.json({ success: true, data: result });
    }
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
