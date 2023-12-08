const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.get('/', async (req, res) => {
  await inventoryController.getInventory(req, res);
});

router.get('/checkout', async (req, res) => {
  await inventoryController.getItemNames(req, res);
});

router.post('/checkout', async (req, res) => {
  await inventoryController.checkoutItems(req, res);
});

router.post('/shipment', async (req, res) => {
  await inventoryController.addShipmentItems(req, res);
});

router.post('/additem', async (req, res) => {
  await inventoryController.addItem(req, res);
});

router.put('/', async (req, res) => {
  await inventoryController.updateInventoryRow(req, res);
});

// Catch-all error handler
router.use((err, req, res, next) => {
  next(err);
});

module.exports = router;
