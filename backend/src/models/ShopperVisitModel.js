const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');
const logger = require('../logger.js')

const ShopperVisit = sequelize.define(
  'shopperVisit',
  {
    hNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    dateOfVisit: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    timestamps: true,
    createdAt: false,
  }
);

// Makes a new entry logging when a shopper visits
async function createVisit(hNumber){

    const result = await ShopperVisit.create({
      hNumber: hNumber,
      dateOfVisit: Date.now(),
    });
    return result;
  }

ShopperVisit.associate = (models) => {
  ShopperVisit.belongsTo(models.Shopper, { foreignKey: 'hNumber' });
};

module.exports = {
  ShopperVisit,
  createVisit
}
