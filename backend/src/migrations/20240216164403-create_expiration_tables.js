'use strict';

module.exports = {
  up: async ({ context: { queryInterface, Sequelize } }) => {
    await queryInterface.createTable('expiration_dates', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      itemId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'inventory',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      notificationSent: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    });
  },

  down: async ({ context: { queryInterface, Sequelize } }) => {
    queryInterface.dropTable('expiration_dates');
  },
};
