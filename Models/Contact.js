const { Sequelize, DataTypes } = require('sequelize');

const Contact = Sequelize.define('Contact', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  linkedId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  linkPrecedence: {
    type: DataTypes.ENUM('secondary', 'primary'),
    defaultValue: 'primary',
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = Contact;
