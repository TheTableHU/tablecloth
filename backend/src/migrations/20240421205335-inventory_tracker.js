'use strict';

module.exports = {
  up: async ({ context: { queryInterface, Sequelize } }) => {
    await queryInterface.createTable('inventory_snapshot', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      dateOfSnapshot: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        primaryKey: true,
      },
      itemName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      itemId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'inventory',
          key: 'id',
        },
      },
    });
  },

  down: async ({ context: { queryInterface, Sequelize } }) => {
    await queryInterface.dropTable('inventory_snapshot');
  },
};
