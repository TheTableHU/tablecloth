// inventoryModel.js

const { DataTypes } = require('sequelize')
const { parseISO, format, isValid } = require('date-fns')
const sequelize = require('../db.js')
const logger = require('../logger.js')

const Inventory = sequelize.define(
  'inventory',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    item: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
    },
    category: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: 'inventory',
    timestamps: true,
    createdAt: false,
  }
)

// Get all items with all data
async function getAllItems() {
  try {
    const items = await Inventory.findAll()
    return formatDate(items)
  } catch (error) {
    throw error
  }
}

// Get all items with only the item name
async function getItemNames() {
  try {
      const allItems = await Inventory.findAll();
      return allItems.map(item => ({ id: item.id, item: item.item }));
  } catch (error) {
    throw error;
  }
}

// Subtract the checkout quantity from the inventory quantity
async function checkout(items) {
  const t = await sequelize.transaction();

  try {
    for (const item of items) {
      const existingItem = await Inventory.findByPk(item.id, { transaction: t });

      if (existingItem) {
        const updatedQuantity = parseInt(existingItem.quantity) - parseInt(item.checkoutQuantity);

        if (isNaN(updatedQuantity)) {
          throw new Error(`Item is NaN. Changes not saved.`);
        }

        await existingItem.update({ quantity: updatedQuantity }, { transaction: t });
      } else {
        logger.error(`Item with ID ${item.id} not found in the inventory.`);
      }
    }

    await t.commit();
    logger.info('Inventory updated successfully.');
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

// Add the item quantity passed into the inventory quantity
async function addShipment(items) {
  const t = await sequelize.transaction();

  try {
    for (const item of items) {
      const existingItem = await Inventory.findByPk(item.id, { transaction: t });

      if (existingItem) {
        const updatedQuantity = parseInt(existingItem.quantity) + parseInt(item.checkoutQuantity);

        if (isNaN(updatedQuantity)) {
          throw new Error(`Item is NaN. Changes not saved.`);
        }

        await existingItem.update({ quantity: updatedQuantity }, { transaction: t });
      } else {
        logger.warn(`Item with ID ${item.id} not found in the inventory.`);
      }
    }

    await t.commit();
    logger.info('Inventory updated successfully.');
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

// Add a new item to the inventory
async function addItem(item, quantity, category) {
  try {
    const newItem = await Inventory.create({
      item,
      quantity,
      category,
    })
    return newItem
  }
  catch (error) {
    throw error
  }
}

// Format the date to be more readable
function formatDate(data) {
  data.forEach((item, index) => {
    const updatedAt = item.updatedAt

    const parsedDate = parseISO(updatedAt)

    if (isValid(parsedDate)) {
      item.setDataValue('updatedAt', format(parsedDate, 'MMMM dd, yyyy'))
    } else {
      logger.error(`Invalid date at index ${index}:`, updatedAt)
    }
  })

  return data
}

// Exporting the functions to be used in controllers.
module.exports = {
  Inventory,
  getAllItems,
  getItemNames,
  checkout,
  addShipment,
  addItem,
}
