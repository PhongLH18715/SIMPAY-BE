const mongoose = require('mongoose');
const slugify = require("../utils/slugify");
const {toJSON, paginate} = require('./plugins');
const {status} = require("../config/order.config");

const orderSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String
  },
  description: {
    type: String
  },
  address: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: status,
    default: status[0],
    required: true
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  }],
  price: {
    type: Number,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  shipper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  deliveryReceived: {
    type: Boolean,
    default: false,
  },
  pickupAt: {
    type: Number
  },
  deliveredAt: {
    type: Number
  },
  createdAt: {
    type: Number
  }
}, {
  collection: 'orders',
  timestamps: true
});


orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

orderSchema.statics.slugGenerator = async function (orderName) {
  let newSlug = slugify(orderName);
  let count = 0;
  while (await this.exists({ slug: newSlug })) {
    newSlug = `${slugify(orderName)}_${++count}`;
  }
  return newSlug;
};

orderSchema.pre("save", {document: true, query: false}, async function (next) {
  const order = this;
  if (order.isModified("title")) {
    order.slug = await Order.slugGenerator(order.title);
  }
  next();
});

orderSchema.pre("deleteOne", {document: true, query: false}, async function (next) {
  const order = this;
  next();
});

const Order = mongoose.model(
  'Order',
  orderSchema
);

module.exports = Order;
