// inventoryModel.js

const { DataTypes } = require('sequelize')
const { parseISO, format, isValid } = require('date-fns');
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

// Example function to get all users.
async function getAllItems() {
  try {
    const items = await Inventory.findAll()
    return formatDate(items);
  } catch (error) {
    console.error('Error fetching items:', error)
    throw error // You might want to handle errors in the controller
  }
}

function formatDate(data) {
  data.forEach((item, index) => {
    const updatedAt = item.updatedAt;

    const parsedDate = parseISO(updatedAt);

    if (isValid(parsedDate)) {
      item.setDataValue('updatedAt', format(parsedDate, 'MMMM dd, yyyy'));
    } 
    else {
      console.log(`Invalid date at index ${index}:`, updatedAt);
      item.updatedAt = 'Invalid Date';
    }
  });

  return data;
}


// Exporting the functions to be used in controllers.
module.exports = {
  Inventory,
  getAllItems,
}
