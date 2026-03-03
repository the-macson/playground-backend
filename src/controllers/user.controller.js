const Problem = require('../models/problem/problem.model');
const ProblemIO = require('../models/problem/problemIO.model');
const Submission = require('../models/problem/submission.model');
const Tag = require('../models/problem/tag.model');
const sequelize = require('../config/db.config');
const { getTestCasesById } = require('../service/user/submission');
const { setupContainer, runCode } = require('../utils/executionEngine');

exports.getProblems = async (req, res) => {
  try {
    const problems = await Problem.findAll({
      attributes: ['id', 'title', 'difficulty'],
      include: [
        {
          model: Tag,
          attributes: ['name'],
          through: { attributes: [] },
        },
      ],
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
  let submissionStatus = 'Pending';
  let passedTestCases = 0;
  const { id, code, language = 'cpp' } = req.body;

  if (!id || !code) {
    return res.status(400).json({ error: 'Problem id and code are required' });
  }

  try {
    const testCases = await getTestCasesById(id);

    if (!testCases.length) {
      return res
        .status(404)
        .json({ error: 'No test cases found for the problem' });
    }
    const isReady = await setupContainer(language.toLowerCase());

    if (!isReady) {
      return res
        .status(500)
        .json({ error: `Failed to setup ${language} environment` });
    }

    let executionErrorInfo = '';
    try {
      passedTestCases = await runCode(language.toLowerCase(), code, testCases);
      submissionStatus =
        passedTestCases === testCases.length ? 'Accepted' : 'Wrong Answer';
    } catch (execError) {
      executionErrorInfo = execError.message;
      submissionStatus = execError.message.includes('Compilation Error')
        ? 'Compilation Error'
        : 'Runtime Error';
    }

    const submission = await Submission.create({
      problemId: id,
      userId: req.authInfo.user_id,
      code,
      language,
      passedTestCases,
      totalTestCases: testCases.length,
      status: submissionStatus,
      errorMessage: submissionStatus !== 'Accepted' ? executionErrorInfo : null,
    });

    return res.status(200).json({
      passedTestCases,
      totalTestCases: testCases.length,
      status: submissionStatus,
      error: executionErrorInfo,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message, status: submissionStatus });
  }
};

exports.getSubmissions = async (req, res) => {
  try {
    const { id: problemId } = req.params;
    const userId = req.authInfo.user_id;
    const submissions = await Submission.findAll({
      where: { problemId, userId },
      order: [['createdAt', 'DESC']],
      limit: 10,
    });

    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.authInfo.user_id;
    const User = require('../models/user/user.model');

    const user = await User.findByPk(userId, {
      attributes: ['name', 'username', 'email', 'createdAt'],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const totalSolved = await Submission.count({
      where: { userId, status: 'Accepted' },
      distinct: true,
      col: 'problemId',
    });

    const totalSubmissions = await Submission.count({
      where: { userId },
    });

    const recentSubmissions = await Submission.findAll({
      where: { userId },
      include: [{ model: Problem, attributes: ['id', 'title'] }],
      order: [['createdAt', 'DESC']],
      limit: 10,
    });

    const languages = await Submission.findAll({
      where: { userId },
      attributes: [
        'language',
        [sequelize.fn('COUNT', sequelize.col('language')), 'count'],
      ],
      group: ['language'],
    });

    res.status(200).json({
      user,
      stats: {
        totalSolved,
        totalSubmissions,
        languages,
      },
      recentSubmissions,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const User = require('../models/user/user.model');

    const leaderboard = await Submission.findAll({
      attributes: [
        'userId',
        [
          sequelize.fn(
            'COUNT',
            sequelize.fn('DISTINCT', sequelize.col('submission.problemId')),
          ),
          'solvedCount',
        ],
        [sequelize.fn('SUM', sequelize.col('passedTestCases')), 'totalScore'],
      ],
      where: { status: 'Accepted' },
      include: [
        {
          model: User,
          attributes: ['name', 'username'],
        },
      ],
      group: ['userId', 'user.id'],
      order: [
        [sequelize.literal('"solvedCount"'), 'DESC'],
        [sequelize.literal('"totalScore"'), 'DESC'],
      ],
      limit: 50,
    });

    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
