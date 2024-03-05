const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db.config');

const User = sequelize.define(
  'user',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('1', '2'),
      defaultValue: '1',
    },
  },
  {
    timestamps: true,
  },
);

module.exports = User;
