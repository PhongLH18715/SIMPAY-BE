const catchAsync = require('../utils/catch-async');
const {productService} = require('../services');
const pick = require("../utils/pick");
const fs = require('fs');

const addProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body, req.user._id);
  res.json({
    message: "Create product successfully",
    product
  });
});

const getProducts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'serial', 'brand', 'category', 'slug', 'creator']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await productService.queryProducts(filter, options);
  res.json(result);
});

const getProduct = catchAsync(async (req, res) => {
  const result = await productService.getProductByFilter({_id: req.params.productId});
  res.json(result);
});

const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProduct(req.params.productId, req.body);
  res.json({
    message: "Update product successfully",
    product
  });
})

const deleteProduct = catchAsync(async (req, res) => {
  const product = await productService.deleteProduct(req.params.productId);
  res.json({
    message: "Delete product successfully",
    product
  });
});

module.exports = {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
}
