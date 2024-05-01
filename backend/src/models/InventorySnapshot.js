// InventorySnapshot.js

module.exports = (sequelize, DataTypes) => {
  const InventorySnapshot = sequelize.define(
    'InventorySnapshot',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      dateOfSnapshot: {
        type: DataTypes.DATE,
        allowNull: false,
        primaryKey: true,
      },
      itemName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'inventory',
          key: 'id',
        },
      },
    },
    {
      tableName: 'InventorySnapshot',
      timestamps: false,
      createdAt: false,
    },
  );

  // Associations
  InventorySnapshot.associate = function (models) {
    InventorySnapshot.belongsTo(models.Inventory, { foreignKey: 'itemId' });
  };

  // Methods

  return InventorySnapshot;
};
