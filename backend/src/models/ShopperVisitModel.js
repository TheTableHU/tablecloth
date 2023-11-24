const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');

const ShopperVisit = sequelize.define(
  'shopperVisit',
  {
    hNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    dateOfVisit: {
      type: DataTypes.DATE,
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
  try {
    const result = await ShopperVisit.create({
      hNumber: hNumber,
      dateOfVisit: Date.now(),
    });
    return result;
  } 
  catch (error) {
    throw error;
  }
}

ShopperVisit.associate = (models) => {
  ShopperVisit.belongsTo(models.Shopper, { foreignKey: 'hNumber' });
};

module.exports = {
  ShopperVisit,
  createVisit
}
