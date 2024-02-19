const express = require('express');
const router = express.Router();

const authApi = require('./authApi');
const adminApi = require('./admin/index');
const { verifyToken, isAdmin } = require('../middlewares/authJwt');

router.use('/auth', authApi);
router.use('/admin', [verifyToken, isAdmin], adminApi);

module.exports = router;
