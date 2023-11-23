const { DataTypes } = require('sequelize')
const { parseISO, format, isValid } = require('date-fns')
const sequelize = require('../db.js')

const InventoryShopper = sequelize.define(
  'InventoryShopper',
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
    tableName: 'inventoryShopper',
    timestamps: true,
    createdAt: false,
  }
)

//InventoryShopper.associate = (models) => {

sequelize.sync().then(() => {
    console.log('Table created successfully');
  });

module.exports = InventoryShopper