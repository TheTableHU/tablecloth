// inventoryController.js

// This file contains the business logic for handling user-related operations.

const inventoryModel = require('../models/inventoryModel');

// Example function to get all users.
function getInventory(req, res) {
  const inventory = inventoryModel.getAllUsers();
  res.json(inventory);
}

// Exporting the functions to be used in routes.
module.exports = {
  getAllUsers,
  // ... other functions related to user operations
};
