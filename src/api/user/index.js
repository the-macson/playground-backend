const express = require('express');
const router = express.Router();
const problemApi = require('./problemApi');

router.use('/problem', problemApi);

module.exports = router;