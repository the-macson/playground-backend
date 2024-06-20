const Problem = require('../models/problem/problem.model');
const ProblemIO = require('../models/problem/problemIO.model');
const sequelize = require('../config/db.config');
const { getTestCasesById } = require('../service/user/submission');
const {
  upAndRunCppCompiler,
  runCppCodeParallel,
} = require('../utils/cppDocker');
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

exports.getProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await Problem.findByPk(id, {
      attributes: [
        'id',
        'title',
        'description',
        'difficulty',
        [
          sequelize.literal(
            '(SELECT COUNT(*) FROM "problemIOs" WHERE "problemIOs"."problemId" = "problem"."id")',
          ),
          'numberOfTestCases',
        ],
      ],
    });
    res.status(200).json(problem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.submissionProblem = async (req, res) => {
  try {
    const { id , code } = req.body;
    const testCases = await getTestCasesById(id);
    if(!testCases.length) {
      res.status(404).json({ error: 'No test cases found for the problem' });
      return;
    }
    if(upAndRunCppCompiler()) {
      const passedTestCases = await runCppCodeParallel(code, testCases);
      return res.status(200).json({ passedTestCases });
    }
    return res.status(200).json(testCases);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}