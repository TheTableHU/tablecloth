// inventoryModel.js

const { DataTypes } = require('sequelize')
const { parseISO, format, isValid } = require('date-fns')
const sequelize = require('../db.js') // Adjust the path based on your project structure

const Inventory = sequelize.define(
  'inventory',
  {
    // Define your fields here
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
    const items = await sequelize.transaction(async t => {
      const allItems = await Inventory.findAll({ transaction: t });
      return allItems.map(item => ({ id: item.id, item: item.item }));
    });

    return items;
  } catch (error) {
    throw error;
  }
}

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
        console.warn(`Item with ID ${item.id} not found in the inventory.`);
      }
    }

    await t.commit();
    console.log('Inventory updated successfully.');
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

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
        console.warn(`Item with ID ${item.id} not found in the inventory.`);
      }
    }

    await t.commit();
    console.log('Inventory updated successfully.');
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

function formatDate(data) {
  data.forEach((item, index) => {
    const updatedAt = item.updatedAt

    const parsedDate = parseISO(updatedAt)

    if (isValid(parsedDate)) {
      item.setDataValue('updatedAt', format(parsedDate, 'MMMM dd, yyyy'))
    } else {
      console.log(`Invalid date at index ${index}:`, updatedAt)
      item.updatedAt = 'Invalid Date'
    }
  })

  return data
}

sequelize.sync()

// Exporting the functions to be used in controllers.
module.exports = {
  Inventory,
  getAllItems,
  getItemNames,
  checkout,
  addShipment,
}
