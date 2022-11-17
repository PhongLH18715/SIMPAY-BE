const catchAsync = require('../utils/catch-async');
const {orderService} = require('../services');
const pick = require("../utils/pick");

const addOrder = catchAsync(async (req, res) => {
  const order = await orderService.createOrder(req.body, req.user._id);
  res.json({
    message: "Create order successfully",
    order
  });
});

const getOrders = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title', 'slug', 'creator', 'shipper', 'phoneNumber', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await orderService.queryOrders(filter, options, req.user);
  res.json(result);
});

const getOrder = catchAsync(async (req, res) => {
  const result = await orderService.getOrderByFilter({_id: req.params.orderId}, req.user);
  res.json(result);
});

const acceptOrder = catchAsync(async (req, res) => {
  const result = await orderService.receivedOrder({_id: req.params.orderId});
  res.json(result);
});

const updateOrder = catchAsync(async (req, res) => {
  const order = await orderService.updateOrder(req.params.orderId, req.body, req.user);
  res.json({
    message: "Update order successfully",
    order
  });
})

const deleteOrder = catchAsync(async (req, res) => {
  const order = await orderService.deleteOrder(req.params.orderId);
  res.json({
    message: "Delete order successfully",
    order
  });
});

module.exports = {
  addOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  acceptOrder
}
