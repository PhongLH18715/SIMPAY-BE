const Joi = require('joi')
const pick = require("../utils/pick");
const httpStatus = require("http-status");
const ApiError = require("../utils/api-error");
const validation = (schema) => (req, res, next) => {
  const schemaObject = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(schemaObject));
  const {value, error} = Joi.compile(schemaObject)
    .prefs({errors: {label: 'key'}, abortEarly: false})
    .validate(object);

  if (error) {
    let message = error.details.map((details) => details.message).join(', ');
    return next(new ApiError(httpStatus.BAD_REQUEST, message));
  }
  Object.assign(req, value);
  next();
}

module.exports = validation;