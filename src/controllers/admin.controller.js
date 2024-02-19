const Problem = require('../models/problem/problem.model');
const Tags = require('../models/problem/tag.model');
exports.createProblem = async (req, res) => {
  try {
    await Problem.create(req.body);
    res.status(201).json({ message: 'Problem created successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProblems = async (req, res) => {
  try {
    const problems = await Problem.find();
    res.status(200).json(problems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found.' });
    }
    return res.status(200).json(problem);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateProblem = async (req, res) => {
  try {
    await Problem.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({ message: 'Problem updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProblem = async (req, res) => {
  try {
    await Problem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Problem deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTags = async (req, res) => {
  try {
    const tags = await Tags.find();
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};