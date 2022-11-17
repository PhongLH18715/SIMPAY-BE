const catchAsync = require('../utils/catch-async');
const {brandService} = require('../services');
const pick = require("../utils/pick");

const addBrand = catchAsync(async (req, res) => {
  const brand = await brandService.createBrand(req.body, req.user._id);
  res.json({
    message: "Create brand successfully",
    brand
  });
});

const getBrands = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'slug', 'creator']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await brandService.queryBrands(filter, options);
  res.json(result);
});

const getBrand = catchAsync(async (req, res) => {
  const result = await brandService.getBrandByFilter({_id: req.params.brandId});
  res.json(result);
});

const updateBrand = catchAsync(async (req, res) => {
  const brand = await brandService.updateBrand(req.params.brandId, req.body);
  res.json({
    message: "Update brand successfully",
    brand
  });
})

const deleteBrand = catchAsync(async (req, res) => {
  const brand = await brandService.deleteBrand(req.params.brandId);
  res.json({
    message: "Delete brand successfully",
    brand
  });
});

module.exports = {
  addBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand
}
