const httpStatus = require('http-status')
const {User, Role} = require('../models');
const ApiError = require("../utils/api-error");

const createRole = async (roleBody) => {
  return Role.create(roleBody);
}

const getUsers = async (roleId, filter, options) => {
  Object.assign(options, {populate: 'role', filter: filter ?? {} });
  return User.paginate({role: roleId}, options);
}

const queryRoles = async (filter, options) => {
  return Role.paginate(filter, options);
}

const getRoleBySlug = async (slug) => {
  return Role.findOne({slug: slug});
}

const getRoleById = async (id) => {
  let role = await Role.findById(id);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }
  return role;
}

const updateRole = async (roleId, updateBody) => {
  const role = await Role.findOne({_id: roleId});
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }

  Object.assign(role, updateBody);
  await role.save();
  return role;
};

const deleteRole = async (roleId) => {
  const role = await Role.findOne({_id: roleId});
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }

  await role.deleteOne();
  return role;
}

module.exports = {
  createRole,
  queryRoles,
  getRoleById,
  getRoleBySlug,
  updateRole,
  deleteRole,
  getUsers
}
