// models/contact.js

const { Sequelize, DataTypes } = require('sequelize')
const { sequelize }= require('../db')

const Contact = sequelize.define('Contact', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 200],
    },
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 2000],
    },
  },
  phoneNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('NOW'),
  },
})

module.exports = Contact
