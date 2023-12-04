const { DataTypes } = require('sequelize')
const { parseISO, format, isValid } = require('date-fns')
const sequelize = require('../db.js')
const logger = require('../logger.js')

const ShopperVisit = require('./ShopperVisitModel.js')

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
  },
  {
    tableName: 'shoppers',
    timestamps: true,
    createdAt: false,
  }
)

// Get all shoppers with all data
async function getAllShoppers() {
  try {
    const shoppers = await Shopper.findAll()
    return formatDate(shoppers)
  } catch (error) {
    logger.error('Error fetching shoppers:', error)
    throw error
  }
}

// Create a new entry in the ShopperVisit table
async function getSpecificShopper(hNumber) {
  try {
    const shopper = await Shopper.findOne({
      where: {
        hNumber: hNumber,
      },
    })
    if (!shopper) {
      logger.error(`Shopper with hNumber ${hNumber} not found`)

      throw new Error(`Shopper with hNumber ${hNumber} not found`)
    }
    return formatDate(shopper)
  } catch (error) {
    logger.error('Error fetching shopper:', error)
    throw error
  }
}

// Create a new shopper
async function createShopper(shopper) {
  const formData = shopper.formData
  try {
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
    }

    for (const key in shopperData) {
      if (shopperData.hasOwnProperty(key) && shopperData[key] === '') {
        shopperData[key] = null
      }
    }

    await sequelize.transaction(async t => {
      const newShopper = await Shopper.create(shopperData, { transaction: t })

      logger.info(`Created shopper with hNumber ${newShopper.hNumber}`)

      ShopperVisit.createVisit(newShopper.hNumber)

      return newShopper
    })
  } catch (error) {
    logger.error('Error creating shopper:', error)
    throw error
  }
}

// Format date for better readability
async function formatDate(shopper) {
  const dateRegistered = shopper.getDataValue('dateRegistered')
  const updatedAt = shopper.getDataValue('updatedAt')

  const parsedDateRegistered = parseAndFormatDate(dateRegistered)

  const parsedUpdatedAt = parseAndFormatDate(updatedAt)

  shopper.setDataValue('dateRegistered', parsedDateRegistered)
  shopper.setDataValue('updatedAt', parsedUpdatedAt)

  return shopper
}

function parseAndFormatDate(dateString) {
  const parsedDate = parseISO(dateString)

  if (isValid(parsedDate)) {
    return format(parsedDate, 'MMMM dd, yyyy')
  } else {
    logger.error(`Invalid date: `, dateString)
    return dateString
  }
}

Shopper.hasMany(ShopperVisit.ShopperVisit, { foreignKey: 'itemId' })

module.exports = {
  Shopper,
  getAllShoppers,
  getSpecificShopper,
  createShopper,
}
