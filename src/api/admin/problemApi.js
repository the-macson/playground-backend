const express = require('express');
const router = express.Router();
const { problemSchema } = require('../../validations');
const { zodErrorHandle } = require('../../helpers/errorHandle');
const {
  createProblem,
  getTags,
  getProblems,
  getProblemById,
  updateProblem,
} = require('../../controllers/admin.controller');

router.post('/create-problem', zodErrorHandle(problemSchema), createProblem);
router.get('/', getProblems);
router.get('/tags', getTags);
router.get('/:id', getProblemById);
router.put('/:id', updateProblem);
module.exports = router;
