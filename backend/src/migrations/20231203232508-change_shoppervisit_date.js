module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('shopperVisits', 'dateOfVisit', {
      type: Sequelize.DATE,
      allowNull: false,
    });

    await queryInterface.renameColumn('shopperVisits', 'dateOfVisit', 'visitTime');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('shopperVisits', 'visitTime', {
      type: Sequelize.DATEONLY,
      allowNull: false,
    });

    await queryInterface.renameColumn('shopperVisits', 'visitTime', 'dateOfVisit');
  },
};
