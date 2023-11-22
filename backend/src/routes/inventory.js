// inventory.js

const express = require('express')
const router = express.Router()
const inventoryController = require('../controllers/inventoryController')

router.get('/inventory', inventoryController.getInventory)
router.get('/checkout', inventoryController.getItemNames)
router.post('/checkout', inventoryController.checkoutItems)

module.exports = router
