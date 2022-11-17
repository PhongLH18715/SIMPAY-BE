const httpStatus = require('http-status')
const {User, Brand} = require('../models');
const ApiError = require("../utils/api-error");

const createBrand = async (body, creatorId) => {
	Object.assign(body, {creator: creatorId});
	const brand = await Brand.create(body);
	await brand.populate([
    {path: "creator", model: "User"}
  ]);
	return brand;
}

const fieldToId = async (filter) => {
	if (filter.creator) {
		const user = await User.findOne({username: filter.creator});
		if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
		filter.creator = user._id;
	}
	return filter;
}

const queryBrands = async (filter, options) => {
  filter = fieldToId(filter);
  return Brand.paginate(filter, options);
}

const getBrandByFilter = async (filter) => {
	filter = fieldToId(filter);
  const brand = await Brand.findOne(filter).populate([
    {path: "creator", model: "User"}
  ]);
  if (!brand) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Brand not found');
  }
  return brand;
};

const updateBrand = async (brandId, updateBody) => {
  const brand = await Brand.findOne({_id: brandId});
  if (!brand) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Brand not found');
  }
	const body = fieldToId(updateBody);
  Object.assign(brand, body);
  await brand.save();
  return brand;
};

const deleteBrand = async (brandId) => {
  const brand = await Brand.findOne({_id: brandId});
  if (!brand) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Brand not found');
  }
  await brand.deleteOne();
  return brand;
}

module.exports = {
  createBrand,
  queryBrands,
	getBrandByFilter,
  updateBrand,
  deleteBrand,
}
