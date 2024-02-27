const { parseISO, format, isValid } = require('date-fns');
const logger = require('../logger.js');
const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Shopper = sequelize.define(
    'Shopper',
    {
      hNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      classification: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      dateRegistered: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      home: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      boxNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      ethnicity: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      childrenUnderSixteen: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      dietRestictions: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      employed: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      helpFindingJob: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      needHousing: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      helpWithHousing: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      snap: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      aboutUs: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
    },
    {
      tableName: 'shoppers',
      timestamps: true,
      createdAt: false,
    },
  );

  // Associations
  Shopper.associate = function (models) {
    Shopper.hasMany(models.ShopperVisit, { foreignKey: 'hNumber' });
  };

  // Get all shoppers with all data
  Shopper.getAllShoppers = async function () {
    try {
      const shoppers = await Shopper.findAll();
      return formatDate(shoppers);
    } catch (error) {
      logger.error('Error fetching shoppers:', error);
    }
  };

  // Get a specific shopper by hNumber
  // Returns the shopper if found, otherwise logs an error
  Shopper.getSpecificShopper = async function (hNumber) {
    try {
      const shopper = await Shopper.findOne({
        where: {
          hNumber: hNumber,
        },
      });
      if (!shopper) {
        logger.error(`Shopper with hNumber ${hNumber} not found`);
        return null;
      }
      return formatDate(shopper);
    } catch (error) {
      logger.error('Error fetching shopper:', error);
      return null;
    }
  };

  // Create a new shopper
  Shopper.createShopper = async function (shopper) {
    if (!shopper || !shopper.formData) {
      logger.error('Invalid shopper data');
      return null;
    }

    const formData = shopper.formData;

    const shopperData = {
      hNumber: parseInt(formData.hNumber, 10),
      classification: formData.classification,
      dateRegistered: new Date().toISOString().slice(0, 10),
      home: formData.home,
      gender: formData.gender,
      boxNumber: formData.box,
      ethnicity: formData.ethnicity,
      childrenUnderSixteen: formData.liveWithUnder16 === 'true' ? 1 : 0,
      dietRestictions: formData.diet,
      employed: formData.employed === 'true' ? 1 : 0,
      helpFindingJob: formData.needJobAssistance === 'true' ? 1 : 0,
      needHousing: formData.needHousingAssistance === 'true' ? 1 : 0,
      helpWithHousing: formData.needHousingAssistance === 'true' ? 1 : 0,
      snap: formData.interestedInSNAP === 'true' ? 1 : 0,
      email: formData.email,
      aboutUs: formData.aboutUs,
    };

    for (const key in shopperData) {
      if (Object.prototype.hasOwnProperty.call(shopperData, key) && shopperData[key] === '') {
        shopperData[key] = null;
      }
    }

    try {
      const newShopper = await sequelize.transaction(async (t) => {
        const createdShopper = await Shopper.create(shopperData, { transaction: t });

        if (!createdShopper) {
          throw new Error(`Error creating shopper with hNumber ${shopperData.hNumber}`);
        }

        logger.info(`Created shopper with hNumber ${createdShopper.hNumber}`);

        await this.sequelize.models.ShopperVisit.createVisit(createdShopper.hNumber);

        return createdShopper;
      });

      return newShopper;
    } catch (error) {
      logger.error('Error creating shopper:', error);
      return null;
    }
  };

  // Finds all shoppers registered within the last week
  // Returns an int representing the number of new shoppers
  Shopper.newShoppersThisWeek = async function () {
    try {
      const count = await Shopper.count({
        where: {
          dateRegistered: {
            [Op.gte]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      });

      return count;
    } catch (error) {
      logger.error('Error fetching shoppers this week:', error);
      return null;
    }
  };

  // Format date for better readability
  async function formatDate(shopper) {
    const dateRegistered = shopper.getDataValue('dateRegistered');
    const updatedAt = shopper.getDataValue('updatedAt');

    const parsedDateRegistered = parseAndFormatDate(dateRegistered);

    const parsedUpdatedAt = parseAndFormatDate(updatedAt);

    shopper.setDataValue('dateRegistered', parsedDateRegistered);
    shopper.setDataValue('updatedAt', parsedUpdatedAt);

    return shopper;
  }

  function parseAndFormatDate(dateString) {
    const parsedDate = parseISO(dateString);

    if (isValid(parsedDate)) {
      return format(parsedDate, 'MMMM dd, yyyy');
    } else {
      logger.error(`Invalid date: `, dateString);
      return dateString;
    }
  }

  return Shopper;
};
