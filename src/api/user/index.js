const express = require('express');
const router = express.Router();
const problemApi = require('./problemApi');
const submissionApi = require('./submissionApi');
const userApi = require('./userApi');
router.use('/problem', problemApi);
router.use('/submission', submissionApi);
router.use('/', userApi);

module.exports = router;
