const express = require('express');
const router = express.Router();
const Tags = require('../../models/problem/tag.model');
const { problemSchema } = require('../../validations');
const { zodErrorHandle } = require('../../helpers/errorHandle');
const {
  createProblem,
  getTags,
} = require('../../controllers/admin.controller');

router.post('/create-problem', zodErrorHandle(problemSchema), createProblem);
router.get('/tags', getTags);

module.exports = router;
