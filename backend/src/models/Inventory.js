// Inventory.js

const { parseISO, format, isValid } = require('date-fns');
const logger = require('../logger.js');

module.exports = (sequelize, DataTypes) => {
  const Inventory = sequelize.define(
    'Inventory',
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
      categoryId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: 'inventory',
      timestamps: true,
      createdAt: false,
    },
  );

  // Associations
  Inventory.associate = function (models) {
    Inventory.belongsTo(models.Category, { foreignKey: 'categoryId' });
  };

  // Methods

  // Get all items with all data
  Inventory.getAllItems = async function () {
    const items = await Inventory.findAll({
      include: [this.sequelize.models.Category],
    });
    return formatDate(items);
  };

  // Get all items with only the item name
  Inventory.getItemNames = async function () {
    const allItems = await Inventory.findAll();
    return allItems.map((item) => ({ id: item.id, item: item.item }));
  };

  // Subtract the checkout quantity from the inventory quantity
  // Return the category name if a category is over the max quantity
  // Return null if no category is over the max quantity or if the checkout was
  Inventory.checkout = async function (items, override) {
    const t = await sequelize.transaction();

    let itemsFromDb = await Inventory.findAll({
      where: { id: items.map((item) => item.id) },
      include: [this.sequelize.models.Category],
    });

    logger.info(itemsFromDb);

    // Check if the category quantity is over the max
    if (override != true) {
      let categoryNameOverLimit = categoryOverLimit(itemsFromDb, items);

      if (categoryNameOverLimit != null) {
        logger.warn(`${categoryNameOverLimit} quantity is over the max.`);
        return { status: 'CategoryOverLimit', category: categoryNameOverLimit };
      }
    }

    try {
      for (const item of items) {
        // Don't need to hit db again
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
      return { status: 'success' };
    } catch (error) {
      await t.rollback();
      return { status: 'failure', message: error.message };
    }
  };

  // Add the item quantity passed into the inventory quantity
  // Return true if the inventory was updated successfully
  // Return false if the inventory was not updated successfully
  Inventory.addShipment = async function (items) {
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
      return true;
    } catch (error) {
      await t.rollback();
      return false;
    }
  };

  // Add a new item to the inventory
  // Return the new item
  Inventory.addItem = async function (item, quantity, categoryId) {
    const newItem = await Inventory.create({
      item,
      quantity,
      categoryId,
    });
    return newItem;
  };

  // Update an inventory row
  // Return the updated row
  Inventory.updateInventoryRow = async function (row) {
    const [, updatedRows] = await Inventory.update(row, {
      where: { id: row.id },
      returning: true,
    });

    return updatedRows[0];
  };

  // Format the date to be more readable
  function formatDate(data) {
    data.forEach((item, index) => {
      const updatedAt = item.updatedAt;

      const parsedDate = parseISO(updatedAt);

      if (isValid(parsedDate)) {
        item.setDataValue('updatedAt', format(parsedDate, 'MMMM dd, yyyy'));
      } else {
        logger.error(`Invalid date at index ${index}:`, updatedAt);
      }
    });

    return data;
  }

  // Check if the category quantity is over the max
  // Returns null if no category is over the max
  // Returns the category name if a category is over the max
  function categoryOverLimit(itemsFromDb, items) {
    const categoryQuantities = {};

    const itemsMap = items.reduce((map, item) => {
      map[item.id] = item.checkoutQuantity;
      return map;
    }, {});

    // Calculate the total quantity for each category
    itemsFromDb.forEach((item) => {
      const categoryName = item.Category.name;
      const currentQuantity = categoryQuantities[categoryName] || 0;
      const checkoutQuantity = itemsMap[item.id] || 0;
      categoryQuantities[categoryName] = currentQuantity + parseInt(checkoutQuantity);
    });

    // Check if any category exceeds the maxQuantity
    for (const categoryName in categoryQuantities) {
      if (categoryQuantities[categoryName] !== undefined) {
        const categoryMaxQuantity = itemsFromDb.find((item) => item.Category.name === categoryName)
          .Category.maxQuantity;
        const categoryCheckoutQuantity = categoryQuantities[categoryName];

        if (categoryMaxQuantity !== null && categoryCheckoutQuantity > categoryMaxQuantity) {
          return categoryName;
        }
      }
    }

    // No category exceeds the maxQuantity
    return null;
  }

  return Inventory;
};
