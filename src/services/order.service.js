const httpStatus = require('http-status')
const {User, Order, Product} = require('../models');
const ApiError = require("../utils/api-error");

const createOrder = async (body, creatorId) => {
	Object.assign(body, {
    creator: creatorId,
    createdAt: Date.now()
  });
	const order = await Order.create(body);
  await Product.updateMany(
    {
      _id: { $in: order.products }
    },
    {
      $set: { available: false }
    }
  );
	await order.populate([
    {path: "products", model: "Product"},
    {path: "creator", model: "User"},
    {path: "shipper", model: "User"}
  ]);
	return order;
}

const fieldToId = async (filter) => {
	if (filter.creator) {
		const user = await User.findOne({username: filter.creator});
		if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'Creator not found');
		filter.creator = user._id;
	}
  if (filter.shipper) {
		const user = await User.findOne({username: filter.shipper});
		if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'Shipper not found');
		filter.shipper = user._id;
	}
	return filter;
}

const queryOrders = async (filter, options, user) => {
  if (user.role.name == 'shipper') {
    filter.deliveryReceive = { $eq: false };
  }
  filter = fieldToId(filter);
  return Order.paginate(filter, options);
}

const getOrderByFilter = async (filter, user) => {
	filter = fieldToId(filter);
  const order = await Order.findOne(filter).populate([
    {path: "products", model: "Product"},
    {path: "creator", model: "User"},
    {path: "shipper", model: "User"}
  ]);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  if (user.role.name == 'shipper' && order.deliveryReceived == true && order.shipper._id.toString() != user._id.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, 'The order has been received by another shipper');
  }
  return order;
};

const acceptOrder = async (orderId, userId) => {
	const order = await Order.findOne({_id: orderId});
  
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  if (order.deliveryReceived == true) {
    throw new ApiError(httpStatus.FORBIDDEN, 'The order has been received by another shipper');
  }
  const user = await User.findOne({_id: userId});
  if (!user.status != 'idle') {
    throw new ApiError(httpStatus.NOT_FOUND, 'Unable to accept order');
  }
  order.deliveryReceived = true;
  order.shipper = user._id;
  user.status = 'delivering';
  await order.save();
  await user.save();
  return order;
};

const updateOrder = async (orderId, updateBody, user) => {
  const order = await Order.findOne({_id: orderId});
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  if (user.role.name == 'shipper' && order.deliveryReceived == true && order.shipper._id.toString() == user._id.toString()) {
    for (let key in updateBody) {
      if (!['pickupAt', 'status', 'deliveredAt', 'reason'].includes(key)) delete updateBody[key];
    }
  }
  else 
  {
    throw new ApiError(httpStatus.FORBIDDEN, 'The order has been received by another shipper');
  }
	const body = fieldToId(updateBody);
  Object.assign(order, body);
  await order.save();
  if (updateBody.status) {
    if (updateBody.status == 'cancelled' || updateBody.status == 'failed') {
      await Product.updateMany(
        {
          _id: { $in: order.products }
        },
        {
          $set: { available: true }
        }
      );
    }
    if (updateBody.status == 'cancelled' || updateBody.status == 'failed' || updateBody.status == 'delivered') {
      await User.updateOne({
        _id: order.shipper._id
      }, {
        $set: { status: 'idle' }
      })
    }
  }
  return order;
};

const deleteOrder = async (orderId) => {
  const order = await Order.findOne({_id: orderId});
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  await order.deleteOne();
  return order;
}

module.exports = {
  createOrder,
  queryOrders,
	getOrderByFilter,
  updateOrder,
  deleteOrder,
  acceptOrder,
}
