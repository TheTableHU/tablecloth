'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Checkout', 'hNumber', {
      type: Sequelize.INTEGER, 
      allowNull: true, 
    });

    await queryInterface.addConstraint('Checkout', {
      fields: ['hNumber'],
      type: 'foreign key',
      name: 'fk_h_number', 
      references: {
        table: 'shoppers', 
        field: 'hNumber', 
      },
      onDelete: 'CASCADE', 
      onUpdate: 'CASCADE', 
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Checkout', 'fk_h_number');

    await queryInterface.removeColumn('Checkout', 'hNumber');
  },
};
