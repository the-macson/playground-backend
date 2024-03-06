const ProblemIO = require('../../models/problem/problemIO.model');
exports.getTestCasesById = async (problemId) => {
  try {
    const testCases = await ProblemIO.findAll({
      where: { problemId },
      attributes: ['input', 'output'],
    });
    return testCases;
  } catch (error) {
    throw new Error(error.message);
  }
};
