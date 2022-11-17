const {Token} = require('../models');
const config = require('../config');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const {tokenTypes} = require("../config/token.config");
const httpStatus = require("http-status");
const ApiError = require("../utils/api-error");

const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type
  }
  return jwt.sign(payload, secret);
}

const saveToken = async (token, userId, expires, type) => {
  return await Token.create({
    token: token,
    user: userId,
    type: type,
    expires: expires.toDate()
  });
}

const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({token: token, user: payload.sub, type: type});
  if (!tokenDoc) {
    throw new Error('Token not found.');
  }
  return tokenDoc;
}

const generateAuthToken = async (user, remember) => {
  // only for access => access token will not be saved to db => require one time until the refresh token was expired
  const accessTokenExpires = (remember === true) ? moment().add(config.jwt.accessExpirationMinutes - 23, 'days') : moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user._id, accessTokenExpires, tokenTypes.ACCESS);

  // refresh token => save to db
  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(user._id, refreshTokenExpires, tokenTypes.REFRESH);
  await saveToken(refreshToken, user._id, refreshTokenExpires, tokenTypes.REFRESH);

  const result = {
    access: {
      token: accessToken,
      expires: accessTokenExpires
    }
  }
  if (refreshToken) result.refresh = {
    token: refreshToken,
    expires: refreshTokenExpires
  }

  return result
}

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthToken
}
