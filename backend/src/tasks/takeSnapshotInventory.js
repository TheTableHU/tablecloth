const logger = require('../logger.js');
const { models } = require('../models/index.js');
const Inventory = models.Inventory;

async function takeSnapshotInventory() {
logger.info('Taking inventory snapshot...')
  const allItems = await Inventory.getAllItems();

  const snapshot = allItems.map((item) => {
    const date = new Date();
    return {
      dateOfSnapshot: date.toLocaleString("en-US", {timeZone: "America/Chicago"}),
      itemName: item.dataValues.item,
      quantity: item.dataValues.quantity,
      itemId: item.dataValues.id,
    };
  });

  try {
    await models.InventorySnapshot.bulkCreate(snapshot);
    logger.info('Inventory snapshot taken');
  } catch (error) {
    logger.error(`Unable to take inventory snapshot: ${error}`);
  }
}

module.exports = takeSnapshotInventory
