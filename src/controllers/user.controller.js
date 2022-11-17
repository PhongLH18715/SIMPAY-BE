const catchAsync = require('../utils/catch-async');
const {userService} = require('../services');
const pick = require("../utils/pick");
const uploadConfig = require('../config/upload.config');
const {User, Role} = require("../models");
const fs = require('fs');

const addUser = catchAsync(async (req, res) => {
  if (!req.file) {
    req.body.avatar = defaultURL.url + "avatar.jpg";
  } else {
    req.body.avatar = uploadConfig.default.url + req.file.filename;
    fs.renameSync(req.file.path, uploadConfig.default.fromModelPath + req.file.filename);
  }
  const user = await userService.createUser(req.body);
  res.json({
    message: "Create user successfully",
    user
  });
});

const addAgent = catchAsync(async (req, res) => {
  req.body.role = "agent";
  addUser(req, res);
});

const addShipper = catchAsync(async (req, res) => {
  req.body.role = "shipper";
  addUser(req, res);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['username', 'fullName', 'email', 'isApproved', 'status', 'dob', 'phoneNumber', 'gender', 'identityNumber']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.json(result);
});

const getAgents = catchAsync(async(req, res) => {
  req.query.role = await Role.findOne({name: 'agent'});
  getUsers(req, res);
})

const getShippers = catchAsync(async(req, res) => {
  req.query.role = await Role.findOne({name: 'shipper'});
  getUsers(req, res);
})

const getUser = catchAsync(async (req, res) => {
  const result = await userService.getUserById(req.params.userId);
  res.json(result);
});

const getUserByRefreshToken = catchAsync(async (req, res) => {
  const result = await userService.getUserByRefreshToken(req.body.refresh_token);
  res.json(result);
});

const selfUpdate = catchAsync(async (req, res) => {
  const checkUser = await User.findOne({username: req.user.username});
  if (!checkUser) return res.status(403).json({
    message: "Invalid token"
  })
  const user = await userService.updateUser(checkUser._id, req.body);
  res.json({
    message: "Update successfully",
    user
  });
});

const updateAgent = catchAsync(async (req, res) => {
  const checkUser = await User.findOne({username: req.params.username});
  if (checkUser.role.name !== 'agent') return res.status(403).json({
    message: "Update failed"
  });
  if (!checkUser) return res.status(404).json({
    message: "User not found"
  })
  const user = await userService.updateUser(checkUser._id, req.body);
  res.json({
    message: "Update user successfully",
    user
  });
})

const updateShipper = catchAsync(async (req, res) => {
  const checkUser = await User.findOne({username: req.params.username});
  if (checkUser.role.name !== 'shipper') return res.status(403).json({
    message: "Update failed"
  });
  const user = await userService.updateUser(checkUser._id, req.body);
  res.json({
    message: "Update user successfully",
    user
  });
})

const approveShippers = catchAsync(async (req, res) => {
  const shippers = Array.isArray(req.body.shippers) ? req.body.shippers : [req.body.shippers];
  await User.updateMany({ 
    username: {
      $in: shippers
    } 
  }, {
    $set: {
      isApproved: true
    }
  })
  res.json({
    message: "Approve successfully"
  });
})

const unapproveShippers = catchAsync(async (req, res) => {
  const shippers = Array.isArray(req.body.shippers) ? req.body.shippers : [req.body.shippers];
  await User.updateMany({ 
    username: {
      $in: shippers
    } 
  }, {
    $set: {
      isApproved: fasle
    }
  })
  res.json({
    message: "Unapprove successfully"
  });
})

const deleteUser = catchAsync(async (req, res) => {
  const user = await userService.deleteUser(req.params.userId);
  res.json({
    message: "Delete user successfully",
    user
  });
});

const deleteShipper = catchAsync(async (req, res) => {
  const checkUser = await User.findOne({username: req.params.username});
  if (checkUser.role.name !== 'shipper') return res.status(403).json({
    message: "Delete failed"
  });
  const user = await userService.deleteUser(req.params.username);
  res.json({
    message: "Delete user successfully",
    user
  });
})

const deleteAgent = catchAsync(async (req, res) => {
  const checkUser = await User.findOne({username: req.params.username});
  if (checkUser.role.name !== 'agent') return res.status(403).json({
    message: "Delete failed"
  });
  const user = await userService.deleteUser(req.params.username);
  res.json({
    message: "Delete user successfully",
    user
  });
})

module.exports = {
  addAgent,
  addShipper,
  getUser,
  getUserByRefreshToken,
  getAgents,
  getShippers,
  selfUpdate,
  updateAgent,
  updateShipper,
  approveShippers,
  unapproveShippers,
  deleteShipper,
  deleteAgent
}
