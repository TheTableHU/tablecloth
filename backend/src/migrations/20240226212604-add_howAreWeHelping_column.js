'use strict';

module.exports = {
  up: async ({ context: { queryInterface, Sequelize } }) => {
    await queryInterface.addColumn('shopperVisits', 'howAreWeHelping', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  down: async ({ context: { queryInterface, Sequelize } }) => {
    await queryInterface.removeColumn('shopperVisits', 'howAreWeHelping');
  },
};
