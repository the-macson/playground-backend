const Problem = require('../models/problem/problem.model');
const ProblemIO = require('../models/problem/problemIO.model');
const Tags = require('../models/problem/tag.model');
const ProblemTag = require('../models/problem/problemTag.model');
exports.createProblem = async (req, res) => {
  try {
    await Problem.create({ ...req.body }, { include: [ProblemIO, ProblemTag] });
    res.status(201).json({ message: 'Problem created successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProblems = async (req, res) => {
  try {
    const problems = await Problem.findAll({
      attributes: ['id', 'title', 'difficulty'],
      // include: [ProblemIO, Tags],
    });
    res.status(200).json(problems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTags = async (req, res) => {
  try {
    const tags = await Tags.findAll({
      attributes: ['id', 'name'],
      include: [Problem],
    });
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};