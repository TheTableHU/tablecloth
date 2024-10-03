'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Checkout', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      items: Sequelize.JSON,
      checkoutDate: Sequelize.DATE,
      userLoggedIn: {
        type: Sequelize.STRING,
      },
    });

    await queryInterface.addConstraint('Checkout', {
      fields: ['userLoggedIn'],
      type: 'foreign key',
      name: 'fk_user_logged_in', 
      references: {
        table: 'Users',
        field: 'hNumber',
      },
      onDelete: 'CASCADE', 
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Checkout', 'fk_user_logged_in');
    await queryInterface.dropTable('Checkout');
  },
};
