const express = require('express');
const router = express.Router();
const {
  submissionProblem,
  getSubmissions,
} = require('../../controllers/user.controller');
router.post('/submit', submissionProblem);
router.get('/:id', getSubmissions);

module.exports = router;
