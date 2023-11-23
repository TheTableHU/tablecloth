// shopperController.js

const shopperModel = require('../models/shopperModel')
const inventoryShopperModel = require('../models/inventoryShopperModel')

async function getAllShoppers(req, res) {
  try {
    const result = await shopperModel.getAllShoppers()
    res.json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

async function checkinShopper(req, res) {
  try {
    const result = await shopperModel.checkinShopper(req.params.hNumber)
    res.json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

async function createShopper(req, res) {
  try {
    const result = await shopperModel.createShopper(req.body)
    res.json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

module.exports = {
  getAllShoppers,
  checkinShopper,
  createShopper,
}
