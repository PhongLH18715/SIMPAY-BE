const mongoose = require('mongoose');
const {toJSON} = require('./plugins');
const {tokenTypes} = require("../config/token.config");

const tokenSchema = mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL],
    required: true
  },
  expires: {
    type: Number,
    required: true
  }
}, {
  collection: 'tokens'
});

tokenSchema.plugin(toJSON);

const Token = mongoose.model(
  'Token',
  tokenSchema
);

module.exports = Token;
