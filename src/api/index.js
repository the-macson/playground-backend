const express = require('express');
const router = express.Router();

const authApi = require('./authApi');
const adminApi = require('./admin/index');
const userApi = require('./user/index');
const { verifyToken, isAdmin } = require('../middlewares/authJwt');

router.use('/auth', authApi);
router.use('/admin', [verifyToken, isAdmin], adminApi);
router.use('/user', verifyToken, userApi);
module.exports = router;
