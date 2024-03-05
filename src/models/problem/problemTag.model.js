const  { DataTypes } = require('sequelize');
const sequelize = require('../../config/db.config');
const Problem = require('./problem.model');
const Tag = require('./tag.model');

const ProblemTag = sequelize.define('problemTag', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    problemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tagId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true,
});

Problem.belongsToMany(Tag, { through: ProblemTag, foreignKey: 'problemId' });
Tag.belongsToMany(Problem, { through: ProblemTag, foreignKey: 'tagId' });
ProblemTag.belongsTo(Problem, { foreignKey: 'problemId' });
ProblemTag.belongsTo(Tag, { foreignKey: 'tagId' });
Problem.hasMany(ProblemTag, { foreignKey: 'problemId' });
Tag.hasMany(ProblemTag, { foreignKey: 'tagId' });

module.exports = ProblemTag;
