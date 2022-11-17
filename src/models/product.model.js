const mongoose = require('mongoose');
const slugify = require("../utils/slugify");
const {toJSON, paginate} = require('./plugins');

const productSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  serial: {
    type: String,
    unique: true,
    required: true
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    required: true
  },
  vat: {
    type: Number,
    required: true
  },
  available: {
    type: Boolean,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  addedAt: {
    type: Number
  }
}, {
  collection: 'products',
  timestamps: true
});

productSchema.plugin(toJSON);
productSchema.plugin(paginate);

productSchema.pre("save", {document: true, query: false}, async function (next) {
  const product = this;
  next();
});

productSchema.pre("deleteOne", {document: true, query: false}, async function (next) {
  const product = this;
  //
  next();
});

const Product = mongoose.model(
  'Product',
  productSchema
);

module.exports = Product;
