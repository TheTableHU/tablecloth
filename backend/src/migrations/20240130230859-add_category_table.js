'use strict';

module.exports = {
  up: async ({ context: { queryInterface, Sequelize } }) => {
    // Create Category table
    await queryInterface.createTable('categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      maxQuantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Get distinct category names from Inventory table
    const categories = await queryInterface.sequelize.query(
      'SELECT DISTINCT category FROM inventory',
      { type: Sequelize.QueryTypes.SELECT },
    );

    // Insert distinct category names into Category table
    for (const category of categories) {
      await queryInterface.sequelize.query(
        'INSERT INTO categories (name, createdAt, updatedAt) VALUES (?, NOW(), NOW())',
        { replacements: [category.category], type: Sequelize.QueryTypes.INSERT },
      );
    }

    // Add categoryId column to Inventory table
    await queryInterface.addColumn('inventory', 'categoryId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'categories', // name of Target model
        key: 'id', // key in Target model that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // Update categoryId in Inventory table based on category name
    await queryInterface.sequelize.query(
      'UPDATE inventory SET categoryId = (SELECT id FROM categories WHERE name = inventory.category)',
      { type: Sequelize.QueryTypes.UPDATE },
    );

    await queryInterface.removeColumn('inventory', 'category');
  },

  down: async ({ context: { queryInterface, Sequelize } }) => {
    await queryInterface.addColumn('inventory', 'category', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // Update category in Inventory table based on categoryId
    await queryInterface.sequelize.query(
      'UPDATE inventory SET category = (SELECT name FROM categories WHERE id = inventory.categoryId)',
      { type: Sequelize.QueryTypes.UPDATE },
    );

    // Remove categoryId from Inventory table
    await queryInterface.removeColumn('inventory', 'categoryId');

    // Drop Category table
    await queryInterface.dropTable('categories');
  },
};
