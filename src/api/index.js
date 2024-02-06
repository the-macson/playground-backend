const express = require('express');
const router = express.Router();

const authApi = require('./authApi');
const adminApi = require('./admin/index');

router.use('/auth', authApi);
router.use('/admin', adminApi);

module.exports = router;