'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the column already exists
    const tableInfo = await queryInterface.describeTable('shopperVisits');
    
    if (!tableInfo.howAreWeHelping) {
      await queryInterface.addColumn('shopperVisits', 'howAreWeHelping', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the column if it exists
    const tableInfo = await queryInterface.describeTable('shopperVisits');
    
    if (tableInfo.howAreWeHelping) {
      await queryInterface.removeColumn('shopperVisits', 'howAreWeHelping');
    }
  },
};
