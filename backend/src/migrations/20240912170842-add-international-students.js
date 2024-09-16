'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('shoppers', 'internationalStudent', {
      type: Sequelize.DataTypes.BOOLEAN,
      allowNull: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('shoppers', 'internationalStudent');
  },
};
