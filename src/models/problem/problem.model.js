const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db.config');

const Problem = sequelize.define('problem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  difficulty: {
    type: DataTypes.ENUM('1', '2', '3'),
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = Problem;
