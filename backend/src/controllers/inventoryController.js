// inventoryController.js

const inventoryModel = require('../models/inventoryModel')

// Example function to get all users.
async function getInventory(req, res) {
  const inventory = await inventoryModel.getAllItems()
  if (Array.isArray(inventory) && inventory.length > 0) {
    // Get columns dynamically from the first item in the array
    const columns = Object.keys(inventory[0].dataValues).map(key => ({
      field: key,
      headerName: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize the first letter
      width: 150, // Adjust the width as needed
      editable: false,
    }))

    columns.forEach(column => {
      switch (column.headerName) {
        case 'Item':
          column.width = 400 // Adjust the width for the 'Quantity' field
          break
        case 'UpdatedAt':
          column.headerName = 'Last Updated' // Rename the 'UpdatedAt' field
          break
        case 'Id':
            column.headerName = 'ID' // Rename the 'id' field. Table will fail to load otherwise
            break
        default:
          break
      }
    })

    res.json({ success: true, columns: columns, data: inventory})
  } else {
    res.json({ success: true, columns: [], data: []})
  }
}

// Exporting the functions to be used in routes.
module.exports = {
  getInventory,
  // ... other functions related to user operations
}
