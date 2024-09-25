'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

     await queryInterface.createTable('Users', { 
      id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    PIN: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    hNumber: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    role: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    });
  
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('Users');
  }
};
