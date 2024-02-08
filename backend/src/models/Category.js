// Category.js

module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    'Category',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      maxQuantity: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: 'categories',
      timestamps: true,
      createdAt: false,
    },
  );

  // Associations
  Category.associate = function (models) {
    Category.hasMany(models.Inventory, { foreignKey: 'categoryId' });
  };

  // Methods

  // Get all categories
  Category.getAllCategories = async function () {
    return await Category.findAll();
  };

  return Category;
};
