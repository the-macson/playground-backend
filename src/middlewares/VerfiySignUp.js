const User = require('../models/user/user.model');

const checkDuplicateEmailOfUser = (req, res, next) => {
  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (user) {
        res.status(400).send({
          message: 'Failed! Email is already in use!',
        });
        return;
      }
      next();
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

const checkDuplicateUsernameOfUser = (req, res, next) => {
  User.findOne({
    username: req.body.username,
  })
    .then((user) => {
      if (user) {
        res.status(400).send({
          message: 'Failed! Username is already in use!',
        });
        return;
      }
      next();
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

const verifySignUp = {
  checkDuplicateEmailOfUser,
  checkDuplicateUsernameOfUser,
};

module.exports = verifySignUp;
