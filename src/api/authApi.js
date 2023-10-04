const { checkDuplicateEmailOfUser, checkDuplicateUsernameOfUser } = require('../middlewares/VerfiySignUp'); 

const { signup, signin } = require("../controllers/auth.controller");
const express = require('express');
const router = express.Router();

router.post('/register', [checkDuplicateEmailOfUser, checkDuplicateUsernameOfUser], signup);
router.post('/login', signin);

module.exports = router;