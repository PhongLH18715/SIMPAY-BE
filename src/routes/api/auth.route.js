const express = require('express');
const {validation, auth} = require('../../middlewares');
const {authController} = require("../../controllers");
const {authValidation} = require("../../validations");

const router = express.Router();

router
  .post('/login', validation(authValidation.login), authController.login)
  .post('/register', validation(authValidation.register), authController.register)
  .post('/logout', auth(), validation(authValidation.logout), authController.logout)
  .post('/refresh-tokens', validation(authValidation.refreshToken), authController.refreshTokens);

module.exports = router;