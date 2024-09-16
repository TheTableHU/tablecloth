'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('inventory', 'barcode', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    // *** Your change here ***
  },

  down: async (queryInterface, Sequelize) => {
    // *** Your change here ***

    await queryInterface.removeColumn('inventory', 'barcode');

    // *** Your change here ***
  },
};