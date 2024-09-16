'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the column already exists
    const tableInfo = await queryInterface.describeTable('shoppers');
    
    if (!tableInfo.aboutUs) {
      await queryInterface.addColumn('shoppers', 'aboutUs', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the column if it exists
    const tableInfo = await queryInterface.describeTable('shoppers');
    
    if (tableInfo.aboutUs) {
      await queryInterface.removeColumn('shoppers', 'aboutUs');
    }
  },
};
