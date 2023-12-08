const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');
const { Op } = require('sequelize');

const ShopperVisit = sequelize.define(
  'shopperVisit',
  {
    hNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    visitTime: {
      type: DataTypes.DATE,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    timestamps: true,
    createdAt: false,
    timezone: 'America/Chicago',
  },
);

// Makes a new entry logging when a shopper visits
async function createVisit(hNumber) {
  const centralTime = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false, // Use 24-hour format
  }).format(new Date());

  const result = await ShopperVisit.create({
    hNumber: hNumber,
    visitTime: centralTime,
  });
  return result;
}

// Checks if shopper has been in the past two weeks
// @return [Boolean] true if they have been twice this week, false if not
async function isShopperAtWeekLimit(hNumber) {
  const currentDate = new Date();

  // Calculate the start of the current week (Sunday)
  const startOfWeek = new Date(currentDate);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  // Calculate the end of the current week (Saturday)
  const endOfWeek = new Date(currentDate);
  endOfWeek.setHours(23, 59, 59, 999);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const visitCount = await ShopperVisit.count({
    where: {
      hNumber: hNumber,
      visitTime: {
        [Op.between]: [startOfWeek, endOfWeek],
      },
    },
  });

  console.log(visitCount);

  return visitCount >= 2;
}

ShopperVisit.associate = (models) => {
  ShopperVisit.belongsTo(models.Shopper, { foreignKey: 'hNumber' });
};

module.exports = {
  ShopperVisit,
  createVisit,
  isShopperAtWeekLimit,
};
