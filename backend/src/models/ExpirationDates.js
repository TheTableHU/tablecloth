// ExpirationDates.js
const logger = require('../logger.js');
const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const ExpirationDates = sequelize.define(
    'ExpirationDates',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        type: DataTypes.DATE,
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
      notificationSent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: 'expiration_dates',
      timestamps: false,
      updatedAt: false,
      createdAt: false,
    },
  );

  // Associations
  ExpirationDates.associate = function (models) {
    ExpirationDates.belongsTo(models.Inventory, { foreignKey: 'itemId' });
  };

  // Methods

  // Get all expiration dates
  ExpirationDates.getAllExpirationDates = async function () {
    const allExpirationDates = await ExpirationDates.findAll({
      include: [this.sequelize.models.Inventory],
    });
    return allExpirationDates;
  };

  // Get all expiration dates that are within 20 days of today
  ExpirationDates.getTwoWeeksExpirationDates = async function () {
    const twoWeeksExpirationDates = await ExpirationDates.findAll({
      where: {
        date: {
          [Op.between]: [new Date(), new Date(new Date().getTime() + (20 * 24 * 60 * 60 * 1000))],
        },
        notificationSent: false,
      },
      include: [this.sequelize.models.Inventory],
    });

    return twoWeeksExpirationDates;
  };

  // Update the notificationSent column to true
  ExpirationDates.updateNotificationSent = async function (ids) {
    const transaction = await sequelize.transaction();

    logger.info(`Updating notificationSent for IDs: ${ids}`);
    try {
      const validIds = ids.filter((id) => id != null);

      await Promise.all(
        validIds.map(async (id) => {
          const expirationDate = await ExpirationDates.findByPk(id, { transaction });

          logger.info(`ExpirationDate: ${expirationDate}`);

          if (expirationDate) {
            expirationDate.notificationSent = true;
            logger.info(`ExpirationDate found for ID: ${id}`);
            await expirationDate.save({ transaction });
          } else {
            logger.warn(`No ExpirationDate found for ID: ${id}`);
          }
        }),
      );

      logger.info('NotificationSent updated successfully');
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  return ExpirationDates;
};
