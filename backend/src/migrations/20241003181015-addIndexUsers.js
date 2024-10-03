'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('Users', ['hNumber'], {
      unique: true, 
      name: 'users_hnumber_index',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Users', 'users_hnumber_index');
  },
};
