const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db.config');
const Problem = require('./problem.model');
const User = require('../user/user.model');

const Submission = sequelize.define(
  'submission',
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    code: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    passedTestCases: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalTestCases: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  },
);

Submission.belongsTo(Problem, { foreignKey: 'problemId' });
Submission.belongsTo(User, { foreignKey: 'userId' });
Problem.hasMany(Submission, { foreignKey: 'problemId' });
User.hasMany(Submission, { foreignKey: 'userId' });

module.exports = Submission;
