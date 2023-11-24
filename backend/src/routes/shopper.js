const express = require('express')
const router = express.Router()
const shopperController = require('../controllers/shopperController.js')

router.get('/', async (req, res) => {
  await shopperController.getAllShoppers(req, res)
})

router.get('/:hNumber', async (req, res) => {
  await shopperController.getSpecificShopper(req, res)
})

router.post('/checkin/:hNumber', async (req, res) => {
  await shopperController.checkinShopper(req, res)
})

router.post('/checkin', async (req, res) => {
  await shopperController.createShopper(req, res)
})

// Catch-all error handler
router.use((err, req, res, next) => {
  next(err)
})

module.exports = router
