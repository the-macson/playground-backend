const express = require('express');
const router = express.Router();

const { authJwt } = require('../../middlewares');
const problemApi = require('./problemApi');
router.use(authJwt.verifyToken, problemApi);

module.exports = router;
