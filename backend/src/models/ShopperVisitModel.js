const { DataTypes } = require('sequelize')
const sequelize = require('../db.js')

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
  }
)

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
    visitTime: centralTime
  })
  return result
}

ShopperVisit.associate = models => {
  ShopperVisit.belongsTo(models.Shopper, { foreignKey: 'hNumber' })
}

module.exports = {
  ShopperVisit,
  createVisit,
}
