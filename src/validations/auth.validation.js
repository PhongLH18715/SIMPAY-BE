const Joi = require('joi');
const {password} = require("./custom.validations");

const login = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().custom(password).required(),
    remember: Joi.boolean()
  })
};

const register = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().custom(password).required(),
    email: Joi.string().required(),
    fullName: Joi.string().required(),
    dob: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    address: Joi.string().required(),
    gender: Joi.string().required()
  })
};

const refreshToken = {
  body: Joi.object().keys({
    refresh_token: Joi.string().required()
  })
};

const logout = {
  body: Joi.object().keys({
    refresh_token: Joi.string().required()
  })
};

module.exports = {
  login,
  refreshToken,
  logout,
  register,
}

