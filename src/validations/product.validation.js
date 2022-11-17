const Joi = require('joi');
const {ObjectId} = require("./custom.validations");

const addProduct = {
  body: Joi.object().keys({
    number: Joi.string().required(),
    serial: Joi.string().required(),
    brand: Joi.string().custom(ObjectId).required(),
    price: Joi.number().required(),
    discount: Joi.number(),
    vat: Joi.number().required(),
    avaiable: Joi.boolean().required()
  })
};

const getProducts = {
  query: Joi.object().keys({
    number: Joi.string(),
    serial: Joi.string().required(),
    brand: Joi.string().custom(ObjectId),
    price: Joi.number(),
    discount: Joi.number(),
    vat: Joi.number(),
    avaiable: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(ObjectId).required()
  })
};

const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(ObjectId).required()
  }),
  body: Joi.object().keys({
    number: Joi.string(),
    serial: Joi.string(),
    brand: Joi.string().custom(ObjectId),
    price: Joi.number(),
    discount: Joi.number(),
    vat: Joi.number(),
    avaiable: Joi.boolean()
  })
};

const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(ObjectId).required()
  })
};

module.exports = {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
}