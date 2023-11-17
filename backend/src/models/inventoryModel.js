// inventoryModel.js

// This file defines the data model for users.

const items = {
  bananas: 5,
  apples: 10,
  oranges: 15,
}
// Example function to get all users.
function Inventory() {
  return items
}

// Exporting the functions to be used in controllers.
module.exports = {
  Inventory,
  // ... other functions related to users
}
