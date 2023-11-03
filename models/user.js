
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db'); 
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('NOW'),
  },
});

module.exports = User;
