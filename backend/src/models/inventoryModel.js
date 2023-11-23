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
    await sequelize.transaction(async (t) => {
      const items = (await Inventory.findAll()).map(item => ({ id: item.id, item: item.item }), { transaction: t })
      return items
    });
  } catch (error) {
    throw error
  }
}

const checkout = async items => {
  try {
    for (const item of items) {
      const existingItem = await Inventory.findByPk(item.id)

      if (existingItem) {
        const updatedQuantity = existingItem.quantity - item.checkoutQuantity

        if (isNaN(updatedQuantity)) {
          throw new Error(`Item is NaN. Changes not saved.`)
        }

        await existingItem.update({ quantity: updatedQuantity })
      } else {
        console.warn(`Item with ID ${item.id} not found in the inventory.`)
      }
    }

    console.log('Inventory updated successfully.')
  } catch (error) {
    throw error
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
}
