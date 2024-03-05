const express = require('express');
const router = express.Router();
const { problemSchema } = require('../../validations');
const { zodErrorHandle } = require('../../helpers/errorHandle');
const {
  createProblem,
  getTags,
  getProblems,
} = require('../../controllers/admin.controller');

router.post('/create-problem', zodErrorHandle(problemSchema), createProblem);
router.get('/', getProblems);
router.get('/tags', getTags);

module.exports = router;
