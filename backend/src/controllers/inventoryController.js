// inventoryController.js

const { models } = require('../models/index.js');
const axios = require('axios');
const inventoryModel = models.Inventory;
const categoryModel = models.Category;

async function getAllCategories(req, res) {
  let categories = await categoryModel.getAllCategories();
  categories.map((category) => {
    return (category.key = category.id);
  });

  if (Array.isArray(categories) && categories.length > 0) {
    res.json({ success: true, data: categories });
  }
}
async function getInventory(req, res) {
  let inventory = await inventoryModel.getAllItems();
  if (Array.isArray(inventory) && inventory.length > 0) {
    inventory = inventory.map((item) => {
      if (item.dataValues.Category) {
        item.dataValues.Category = item.dataValues.Category.name;
      }
      return item;
    });

    // Get columns dynamically from the first item in the array
    let columns = Object.keys(inventory[0].dataValues).map((key) => ({
      field: key,
      headerName: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize the first letter
      width: 150,
      editable: false,
    }));

    columns = columns.filter((column) => column.field !== 'categoryId');

    columns.forEach((column) => {
      switch (column.headerName) {
        case 'Item':
          column.width = 400;
          column.editable = true;
          break;
        case 'Quantity':
          column.editable = true;
          break;
        case 'UpdatedAt':
          column.headerName = 'Last Updated';
          break;
        case 'Id':
          column.headerName = 'ID';
          break;
        default:
          break;
      }
    });

    res.json({ success: true, columns: columns, data: inventory });
  } else {
    res.json({ success: true, columns: [], data: [] });
  }
}

async function getItemNames(req, res) {
  let items = await inventoryModel.getItemNames();
  items.map((item) => {
    return (item.key = item.id);
  });

  if (Array.isArray(items) && items.length > 0) {
    res.json({ success: true, data: items });
  }
}

async function checkoutItems(req, res) {
  const { items } = req.body;

  if (Array.isArray(items) && items.length > 0) {
    const checkoutResult = await inventoryModel.checkout(items, req.body.override);

    if (checkoutResult.status === 'success') {
      res.json({ success: true });
    } else if (checkoutResult.status === 'CategoryOverLimit') {
      res.status(400).json({ success: false, category: checkoutResult.category });
    } else {
      res.json({ success: false });
    }
  } else {
    res.json({ success: false });
  }
}

async function addShipmentItems(req, res) {
  const { items } = req.body;

  if (Array.isArray(items) && items.length > 0) {
    const shipmentResult = await inventoryModel.addShipment(items);

    if (shipmentResult) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } else {
    res.json({ success: false });
  }
}

async function addItem(req, res) {
  const { item, quantity, category } = req.body;

  if (item && quantity && category) {
    const addResult = await inventoryModel.addItem(item, quantity, category);

    if (addResult) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } else {
    res.json({ success: false });
  }
}

async function addCategory(req, res) {
  const { item, maxQuantity } = req.body;

  if (item && maxQuantity) {
    const addResult = await categoryModel.addCategory(item, maxQuantity);

    if (addResult) {
      res.json({ success: true })
    } else {
      res.json({ success: false })
    }
  } else {
    res.json({ sucess: false })
  }
}

async function updateInventoryRow(req, res) {
  const row = req.body.row;

  if (row.id) {
    const result = await inventoryModel.updateInventoryRow(row);

    res.json({ success: result !== null ? true : false });
  }
}

async function getBarcodeInfo(req, res){
  const upc = req.params.upc
  try {
    const response = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${upc}`);
    let responseData = await response.json();
    res.json(responseData);
  } catch (error) {
    res.status(500).send(error.toString());
  }
}

module.exports = {
  getBarcodeInfo,
  getInventory,
  getItemNames,
  checkoutItems,
  addShipmentItems,
  addItem,
  updateInventoryRow,
  getAllCategories,
  addCategory
};
