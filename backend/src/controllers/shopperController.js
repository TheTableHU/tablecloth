// shopperController.js

const shopperModel = require('../models/shopperModel')

async function getAllShoppers(req, res) {
  shopperModel.getAllShoppers().then(result => {
    res.json({ success: true, data: result })
  })
}

async function getSpecificShopper(req, res) {
  shopperModel.getSpecificShopper(req.params.hNumber).then(result => {
    res.json({ success: true, data: result })
  })
}

async function createShopper(req, res) {
  shopperModel.createShopper(req.body).then(result => {
    res.json({ success: true, data: result })
  })
}

module.exports = {
  getAllShoppers,
  getSpecificShopper,
  createShopper,
}
