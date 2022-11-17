const Joi = require('joi');
const {ObjectId} = require("./custom.validations");

const addOrder = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string(),
    address: Joi.string().required(),
    phoneNumber: Joi.number().required(),
    status: Joi.string(),
    products: Joi.array().items(Joi.string().custom(ObjectId)),
  })
};

const getOrders = {
  query: Joi.object().keys({
    title: Joi.string(),
    status: Joi.string(),
    phoneNumber: Joi.string(),
    slug: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(ObjectId).required()
  })
};

const acceptOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(ObjectId).required()
  })
};

const updateOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(ObjectId).required()
  }),
  body: Joi.object().keys({
    title: Joi.string(),
    description: Joi.string(),
    address: Joi.string(),
    phoneNumber: Joi.number(),
    shipper: Joi.string().custom(ObjectId),
    pickupAt: Joi.number(),
    status: Joi.string(),
    deliveredAt: Joi.number(),
    deliveryReceived: Joi.boolean(),
  })
};

const deleteOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(ObjectId).required()
  })
};

module.exports = {
  addOrder,
  getOrders,
  getOrder,
  updateOrder,
  acceptOrder,
  deleteOrder
}