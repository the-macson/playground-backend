const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db.config');
const Problem = require('./problem.model');

const ProblemIO = sequelize.define(
  'problemIO',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    problemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    input: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    output: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  },
);

ProblemIO.belongsTo(Problem, { foreignKey: 'problemId', onDelete: 'CASCADE' });
Problem.hasMany(ProblemIO, { foreignKey: 'problemId' });

module.exports = ProblemIO;
