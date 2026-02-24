const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user.controller');
const authJwt = require('../../middlewares/authJwt');

router.get('/profile', [authJwt.verifyToken], userController.getProfile);
router.get(
  '/leaderboard',
  [authJwt.verifyToken],
  userController.getLeaderboard,
);

module.exports = router;
