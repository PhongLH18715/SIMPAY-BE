const Joi = require('joi');
const {ObjectId} = require("./custom.validations");

const addBrand = {
  body: Joi.object().keys({
    name: Joi.string().required()
  })
};

const getBrands = {
  query: Joi.object().keys({
    name: Joi.string(),
    slug: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getBrand = {
  params: Joi.object().keys({
    brandId: Joi.string().custom(ObjectId).required()
  })
};

const updateBrand = {
  params: Joi.object().keys({
    brandId: Joi.string().custom(ObjectId).required()
  }),
  body: Joi.object().keys({
    name: Joi.string()
  })
};

const deleteBrand = {
  params: Joi.object().keys({
    brandId: Joi.string().custom(ObjectId).required()
  })
};

module.exports = {
  addBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand
}