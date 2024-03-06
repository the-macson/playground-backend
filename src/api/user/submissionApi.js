const express = require('express');
const router = express.Router();
const { submissionProblem } = require('../../controllers/user.controller');
router.post('/submit', submissionProblem);

module.exports = router;