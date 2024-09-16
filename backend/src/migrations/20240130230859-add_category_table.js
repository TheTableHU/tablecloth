'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the 'category' column exists
    const columns = await queryInterface.describeTable('inventory');
    if (columns.category) {
      // Existing migration code if 'category' column exists
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

      const categories = await queryInterface.sequelize.query(
        'SELECT DISTINCT category FROM inventory',
        { type: Sequelize.QueryTypes.SELECT }
      );

      for (const category of categories) {
        await queryInterface.sequelize.query(
          'INSERT INTO categories (name, createdAt, updatedAt) VALUES (?, NOW(), NOW())',
          { replacements: [category.category], type: Sequelize.QueryTypes.INSERT }
        );
      }

      await queryInterface.addColumn('inventory', 'categoryId', {
        type: Sequelize.INTEGER,
        references: {
          model: 'categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });

      await queryInterface.sequelize.query(
        'UPDATE inventory SET categoryId = (SELECT id FROM categories WHERE name = inventory.category)',
        { type: Sequelize.QueryTypes.UPDATE }
      );

      await queryInterface.removeColumn('inventory', 'category');
    } else {
      console.log("The 'category' column does not exist in the 'inventory' table.");
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('inventory', 'category', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.sequelize.query(
      'UPDATE inventory SET category = (SELECT name FROM categories WHERE id = inventory.categoryId)',
      { type: Sequelize.QueryTypes.UPDATE }
    );

    await queryInterface.removeColumn('inventory', 'categoryId');
    await queryInterface.dropTable('categories');
  },
};
