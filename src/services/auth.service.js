const httpStatus = require("http-status");
const ApiError = require("../utils/api-error");
const {Token, User} = require('../models');
const {tokenTypes} = require("../config/token.config");
const userService = require("./user.service");
const tokenService = require("./token.service");

const loginWithUsername = async (username, password) => {
  const user = await userService.getUserByUsername(username);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (!await user.isPasswordMatch(password)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Wrong password');
  }

  return user;
}

const register = async (body) => {
  const temp = {
    username: body.username,
    password: body.password,
    email: body.email,
    fullName: body.fullName,
    dob: body.dob,
    address: body.address,
    phoneNumber: body.phoneNumber,
    gender: body.gender,
    role: 'shipper',
    isApproved: false,
    status: 'inactive'
  }
  const user = userService.createUser(temp);
  return user;
}

const logout = async (userId, refreshToken) => {
  const tokenDoc = await Token.findOne({user: userId, token: refreshToken, type: tokenTypes.REFRESH});
  if (!tokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Token not found');
  }
  return tokenDoc.deleteOne();
}

const refreshAuth = async (refreshToken) => {
  try {
    const tokenDoc = await Token.findOne({token: refreshToken});
    if (!tokenDoc) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Token not found');
    }

    const user = await userService.getUserById(tokenDoc.user);

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    return tokenService.generateAuthToken(user);
  } catch (e) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }
}

module.exports = {
  loginWithUsername,
  register,
  logout,
  refreshAuth
}
