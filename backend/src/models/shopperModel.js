const { DataTypes } = require('sequelize')
const { parseISO, format, isValid } = require('date-fns')
const sequelize = require('../db.js') // Adjust the path based on your project structure

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

async function getAllShoppers() {
  try {
    const shoppers = await Shopper.findAll()
    return formatDate(shoppers)
  } catch (error) {
    console.error('Error fetching shoppers:', error)
    throw error
  }
}

async function checkinShopper(hNumber) {
  try {
    const shopper = await Shopper.findOne({
      where: {
        hNumber: hNumber,
      },
    })
    return formatDate(shopper)
  } catch (error) {
    console.error('Error fetching shopper:', error)
    throw error
  }
}

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
      email: formData.email
    };

    for (const key in shopperData) {
      if (shopperData.hasOwnProperty(key) && shopperData[key] === '') {
        shopperData[key] = null;
      }
    }

    console.log('shopperData:', shopperData)

    await sequelize.transaction(async (t) => {
      const newShopper = await Shopper.create( shopperData, { transaction: t });
      return newShopper;
    });
  } catch (error) {
    console.log('Error creating shopper:', error)
    throw error
  }
}

function formatDate(data) {
  data.forEach((item, index) => {
    const dateRegistered = item.dateRegistered

    const parsedDate = parseISO(dateRegistered)

    if (isValid(parsedDate)) {
      item.setDataValue('dateRegistered', format(parsedDate, 'MMMM dd, yyyy'))
    } else {
      console.log(`Invalid date at index ${index}:`, dateRegistered)
      item.dateRegistered = 'Invalid Date'
    }
  })

  return data
}

sequelize.sync()

module.exports = {
  Shopper,
  getAllShoppers,
  checkinShopper,
  createShopper,
}
