'use strict';

module.exports = {
  up: async ({ context: { queryInterface, Sequelize } }) => {
    await queryInterface.addColumn('shoppers', 'aboutUs', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  down: async ({ context: { queryInterface, Sequelize } }) => {
    await queryInterface.removeColumn('shoppers', 'aboutUs');
  },
};
