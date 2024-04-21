// InventorySnapshot.js

module.exports = (sequelize, DataTypes) => {
    const InventorySnapshot = sequelize.define(
      'InventorySnapshot',
      {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
      },
    },
      {
        tableName: 'InventorySnapshot',
        timestamps: true,
        createdAt: false,
      },
    );
  
    // Associations
    InventorySnapshot.associate = function (models) {
        InventorySnapshot.hasMany(models.Inventory, { foreignKey: 'itemId' });
    };
  
    // Methods
  
    return InventorySnapshot;
  };
  