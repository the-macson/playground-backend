const express = require('express');
const router = express.Router();
const problemApi = require('./problemApi');
const submissionApi = require('./submissionApi');
router.use('/problem', problemApi);
router.use('/submission', submissionApi);

module.exports = router;