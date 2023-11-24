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
      width: 150,
      editable: false,
    }))

    columns.forEach(column => {
      switch (column.headerName) {
        case 'Item':
          column.width = 400
          break
        case 'UpdatedAt':
          column.headerName = 'Last Updated'
          break
        case 'Id':
          column.headerName = 'ID'
          break
        default:
          break
      }
    })

    res.json({ success: true, columns: columns, data: inventory })
  } else {
    res.json({ success: true, columns: [], data: [] })
  }
}

async function getItemNames(req, res) {
  let items = await inventoryModel.getItemNames()
  items.map(item => {
    return (item.key = item.id)
  })

  if (Array.isArray(items) && items.length > 0) {
    res.json({ success: true, data: items })
  }
}

async function checkoutItems(req, res) {
  const { items } = req.body

  if (Array.isArray(items) && items.length > 0) {
    const checkoutResult = await inventoryModel.checkout(items)

    if (checkoutResult) {
      res.json({ success: true })
    } else {
      res.json({ success: false })
    }
  } else {
    res.json({ success: false })
  }
}

async function addShipmentItems(req, res) {
  const { items } = req.body

  if (Array.isArray(items) && items.length > 0) {
    const shipmentResult = await inventoryModel.addShipment(items)

    if (shipmentResult) {
      res.json({ success: true })
    } else {
      res.json({ success: false })
    }
  } else {
    res.json({ success: false })
  }
}

async function addItem(req, res) {
  const { item, quantity, category } = req.body

  if (item && quantity && category) {
    const addResult = await inventoryModel.addItem(item, quantity, category)

    if (addResult) {
      res.json({ success: true })
    } else {
      res.json({ success: false })
    }
  } else {
    res.json({ success: false })
  }
}

module.exports = {
  getInventory,
  getItemNames,
  checkoutItems,
  addShipmentItems,
  addItem,
}
