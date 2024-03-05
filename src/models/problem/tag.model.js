const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db.config');
const Tag = sequelize.define('tag', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  timestamps: true,
});

module.exports = Tag;
