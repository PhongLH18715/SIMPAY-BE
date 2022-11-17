const mongoose = require('mongoose');

const ObjectId = (value, helpers) => {
  if (!mongoose.isValidObjectId(value)) {
    return helpers.message(`${value} was not a valid ObjectId`);
  }
  return value;
}

const password = (value, helpers) => {
  if (value < 8) {
    return helpers.message("Password must be at least 8 characters")
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message("Password must contain at least 1 letter and 1 number")
  }

  return value;
}

module.exports = {
  ObjectId,
  password
}