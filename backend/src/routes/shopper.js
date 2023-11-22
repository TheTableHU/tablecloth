// shopper.js

const express = require('express')
const router = express.Router()
const shopperController = require('../controllers/shopperController.js')

// other routes related to inventory operations
router.get('/shopper', shopperController.getAllShoppers)
router.get('/shopper/:id', shopperController.getSpecificShopper)
router.post('/shopper', shopperController.createShopper)

module.exports = router
