const { parseISO, format, isValid } = require('date-fns');
const logger = require('../logger.js');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {

  const Checkout = sequelize.define('Checkout', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    items: DataTypes.JSON,
    checkoutDate: DataTypes.DATE,
    userLoggedIn: DataTypes.STRING, 
  }, {
    tableName: 'Checkout',
    timestamps: false,
  });

  Checkout.associate = function (models) {
    Checkout.belongsTo(models.Users, { foreignKey: 'userLoggedIn', targetKey: 'hNumber' });
  };

  return Checkout;
};
