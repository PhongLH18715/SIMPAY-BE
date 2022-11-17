const express = require('express');
const userController = require('../../controllers/user.controller');
const {auth, validation, upload} = require("../../middlewares");
const {userValidation} = require("../../validations");

const router = express.Router();

router
  //.get('/', auth(), validation(userValidation.getUsers), userController.getUsers)
  .get('/:userId', auth(), validation(userValidation.getUser), userController.getUser)
  .get('/get-agents', auth('MANAGE_ALL_AGENT'), validation(userValidation.getUsers), userController.getAgents)
  .get('/get-shippers', auth('MANAGE_ALL_SHIPPER'), validation(userValidation.getUsers), userController.getShippers)
  // .post('/delete/:userId',auth(), validation(userValidation.deleteUser), userController.deleteUser)
  .post('/add-agent', auth('MANAGE_ALL_AGENT'), validation(userValidation.addUser), upload.single('avatar'), userController.addAgent)
  .post('/add-shipper', auth('MANAGE_ALL_SHIPPER'), validation(userValidation.addUser), upload.single('avatar'), userController.addShipper)
  .post('/self-update', auth(), validation(userValidation.selfUpdate), upload.single('avatar'), userController.selfUpdate)
  .post('/update-agent/:username', auth('MANAGE_ALL_AGENT'), validation(userValidation.updateUser), upload.single('avatar'), userController.updateAgent)
  .post('/update-shipper/:username', auth('MANAGE_ALL_SHIPPER'), validation(userValidation.updateUser), upload.single('avatar'), userController.updateShipper)
  .post('/approve-shippers', auth('MANAGE_ALL_SHIPPER'), validation(userValidation.approveShippers), userController.approveShippers)
  .post('/unapprove-shippers', auth('MANAGE_ALL_SHIPPER'), validation(userValidation.approveShippers), userController.unapproveShippers)
  .post('/delete-shipper/:username',auth('MANAGE_ALL_SHIPPER'), validation(userValidation.deleteUser), userController.deleteShipper)
  .post('/delete-agent/:username',auth('MANAGE_ALL_AGENT'), validation(userValidation.deleteUser), userController.deleteAgent)
  .post('/refresh-token', userController.getUserByRefreshToken);

module.exports = router;