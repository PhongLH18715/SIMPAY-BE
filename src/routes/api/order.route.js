const express = require('express');
const orderController = require('../../controllers/order.controller');
const {auth, validation} = require("../../middlewares");
const {orderValidation} = require("../../validations");

const router = express.Router();

router
  .get('/', auth(), validation(orderValidation.getOrders), orderController.getOrders)
  .get('/:orderId', auth(), validation(orderValidation.getOrder), orderController.getOrder)
  .post('/add', auth('ADD_ORDER'), validation(orderValidation.addOrder), orderController.addOrder)
  .post('/accept', auth('ACCEPT_ORDER'), validation(orderValidation.acceptOrder), orderController.acceptOrder)
  .post('/update/:orderId', auth('UPDATE_ORDER'), validation(orderValidation.updateOrder), orderController.updateOrder)
  .post('/delete/:orderId',auth('DELETE_ORDER'), validation(orderValidation.deleteOrder), orderController.deleteOrder)

module.exports = router;