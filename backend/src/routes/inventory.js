const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { checkCredentials, requireVolunteerPermissions, requireWorkerPermissions, requireAdminPermissions } = require('../checkCredentials.js');


router.get('/', async (req, res) => {
  await inventoryController.getInventory(req, res);
});

router.get('/checkout/',requireVolunteerPermissions, inventoryController.getItemNames);

router.post('/checkout', requireVolunteerPermissions, inventoryController.checkoutItems);
router.post('/shipment', requireWorkerPermissions, inventoryController.addShipmentItems);
router.post('/additem', requireWorkerPermissions, inventoryController.addItem);
router.put('/', requireWorkerPermissions, inventoryController.updateInventoryRow);
router.get('/getCategories', requireVolunteerPermissions, inventoryController.getAllCategories);
router.post('/addCategory', requireWorkerPermissions, inventoryController.addCategory)
router.get('/barcodeInfo/:upc', requireWorkerPermissions, inventoryController.getBarcodeInfo);
// Catch-all error handler
router.use((err, req, res, next) => {
  next(err);
});

module.exports = router;
