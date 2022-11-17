const Joi = require('joi');
const {password, ObjectId} = require("./custom.validations");

const addUser = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().custom(password).required(),
    fullName: Joi.string(),
    role: Joi.string(),
    gender: Joi.string(),
    phoneNumber: Joi.alternatives().try(Joi.number(), Joi.string()),
    dob: Joi.alternatives().try(Joi.number(), Joi.string()),
    address: Joi.string(),
    identityNumber: Joi.alternatives().try(Joi.number(), Joi.string()),
    status: Joi.string(),
    avatar: Joi.any(),
    isApproved: Joi.boolean()
  })
};

const getUsers = {
  query: Joi.object().keys({
    username: Joi.string(),
    email: Joi.string(),
    fullName: Joi.string(),
    gender: Joi.string(),
    phoneNumber: Joi.alternatives().try(Joi.number(), Joi.string()),
    dob: Joi.alternatives().try(Joi.number(), Joi.string()),
    identityNumber: Joi.alternatives().try(Joi.number(), Joi.string()),
    status: Joi.string(),
    isApproved: Joi.boolean(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getUser = {
  params: Joi.object().keys({
    username: Joi.string()
  })
};

const selfUpdate = {
  body: Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string().custom(password),
    fullName: Joi.string(),
    gender: Joi.string(),
    phoneNumber: Joi.alternatives().try(Joi.number(), Joi.string()),
    dob: Joi.alternatives().try(Joi.number(), Joi.string()),
    address: Joi.string(),
    identityNumber: Joi.alternatives().try(Joi.number(), Joi.string()),
    status: Joi.string(),
    avatar: Joi.any(),
  })
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(ObjectId).required()
  }),
  body: Joi.object().keys({
    username: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().custom(password),
    fullName: Joi.string(),
    role: Joi.string(),
    gender: Joi.string(),
    phoneNumber: Joi.alternatives().try(Joi.number(), Joi.string()),
    dob: Joi.alternatives().try(Joi.number(), Joi.string()),
    address: Joi.string(),
    identityNumber: Joi.alternatives().try(Joi.number(), Joi.string()),
    status: Joi.string(),
    avatar: Joi.any(),
    isApproved: Joi.boolean()
  })
};

const approveShippers = {
  body: Joi.object().keys({
    shippers: Joi.any()
  })
}

const deleteUser = {
  params: getUser.params
}

module.exports = {
  addUser,
  getUsers,
  getUser,
  selfUpdate,
  updateUser,
  deleteUser,
  approveShippers,
}