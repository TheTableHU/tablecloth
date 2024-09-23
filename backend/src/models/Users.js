const { parseISO, format, isValid } = require('date-fns');
const logger = require('../logger.js');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  
let privateKey;
try {
   privateKey = fs.readFileSync(path.join(__dirname, '../../keys/tablecloth_private.pem'), 'utf8');
} catch (error) {
  logger.error(`Failed to read private key: ${error.message}`);
}

  const Users = sequelize.define('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    PIN: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'Users',
    timestamps: false,
  });

  Users.login = async function (hNumber, PIN) {
    const findUser = await Users.findOne({ where: { hNumber } });

    if (findUser) {
      const isMatch = await bcrypt.compare(PIN, findUser.PIN);

      if (isMatch) {
        const token = await generateToken({
          name: findUser.name,
          email: findUser.email,
          role: findUser.role,
        });
        logger.info('User ' + findUser.name + ' has logged in successfully.' )
        return { status: 200, token, data: {
          name: findUser.name,
          email: findUser.email,
          role: findUser.role,
        } };
      } else {
        logger.error("H#" + findUser.hNumber + " used with incorrect PIN.")
        return { status: 401, message: 'Invalid PIN' };
      }
    } else {
      logger.error("Error loggin in: H#" + hNumber + " not found.")
      return { status: 404, message: 'User not found' };
    }
  };

  const generateToken = async (payload) => {
    const secretKey = privateKey;
    const options = {
      expiresIn: '1h',
      algorithm: 'RS256'
    };

    try {
      const token = await jwt.sign(payload, secretKey, options);
      return token;
    } catch (error) {
      logger.error(`Token generation failed: ${error.message}`);
      throw error;
    }
  };


  return Users;
};
