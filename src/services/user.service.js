const httpStatus = require('http-status')
const {User, Token, Role} = require('../models');
const ApiError = require("../utils/api-error");

const createUser = async (userBody, ) => {
  if (userBody.role) {
    userBody.role = await User.convertRole(userBody.role);
    if (!userBody.role) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
    }
  }
  if (await User.isUsernameOrEmailTaken(userBody.username, userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Username or Email was taken');
  }
  return User.create(userBody);
}

const queryUsers = async (filter, options) => {
  Object.assign(options, {populate: "role"});
  return User.paginate(filter, options);
}

const getUserByUsername = async (username) => {
  return User.findOne({username});
}

const getUserByRefreshToken = async (refreshToken) => {
  let token = await Token.findOne({token: refreshToken});
  if (!token) throw new ApiError(httpStatus.NOT_FOUND, 'Token not found');
  return User.findOne({_id: token.user}).populate({path: "role", model: "Role"});
}

const updateUser = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (await User.isUsernameOrEmailTaken(updateBody.username, updateBody.email, userId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Username or Email was taken');
  }
  if (updateBody.role) {
    updateBody.role = await User.convertRole(updateBody.role);

    if (!updateBody.role) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
    }
  }
  if (updateBody.currentPassword) {
    if (!(await user.isPasswordMatch(updateBody.currentPassword))) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Current password not matched')
    }
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const deleteUser = async (username) => {
  const user = await User.findOne({username: username});
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.deleteOne();
  return user;
}

module.exports = {
  createUser,
  queryUsers,
  getUserByUsername,
  getUserByRefreshToken,
  updateUser,
  deleteUser,
}
