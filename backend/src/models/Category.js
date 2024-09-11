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

  Category.addCategory = async function (name, maxQuantity) {
    const newCat = await Category.create({
      name,
      maxQuantity,
      createdAt: new Date()
    });

    if (newCat) {
      return newCat;
    } else {
      return null;
    }
  }

  return Category;
};
