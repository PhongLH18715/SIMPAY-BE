const httpStatus = require('http-status')
const {User, Product, Brand, Category} = require('../models');
const ApiError = require("../utils/api-error");

const createProduct = async (body, creatorId) => {
	Object.assign(body, {
		creator: creatorId,
		addedAt: Date.now(),
	});
	const brand = await Brand.findOne({name: body.brand});
	const category = await Category.findOne({name: body.category});
	if (!brand) throw new ApiError(httpStatus.BAD_REQUEST, 'Brand not found');
	if (!category) throw new ApiError(httpStatus.BAD_REQUEST, 'Category not found');
	Object.assign(body, {
		brand: brand._id,
		category: category._id
	});
	const product = await Product.create(body);
	await product.populate([
    {path: "creator", model: "User"},
    {path: "category", model: "Category"},
		{path: "brand", model: "Brand"}
  ]);
	return product;
}

const fieldToId = async (filter) => {
	if (filter.brand) {
		const brand = await Brand.findOne({name: filter.brand});
		if (!brand) throw new ApiError(httpStatus.NOT_FOUND, 'Brand not found');
		filter.brand = brand._id;
	}
	if (filter.category) {
		const category = await Category.findOne({name: filter.brand});
		if (!category) throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
		filter.category = category._id;
	}
	if (filter.creator) {
		const user = await User.findOne({username: filter.creator});
		if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
		filter.creator = user._id;
	}
	return filter;
}

const queryProducts = async (filter, options) => {
  filter = fieldToId(filter);
  return Product.paginate(filter, options);
}

const getProductByFilter = async (filter) => {
	filter = fieldToId(filter);
  const product = await Product.findOne(filter).populate([
    {path: "creator", model: "User"},
    {path: "category", model: "Category"},
	{path: "brand", model: "Brand"}
  ]);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  return product;
};

const updateProduct = async (productId, updateBody) => {
  const product = await Product.findOne({_id: productId});
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
	const body = fieldToId(updateBody);
  Object.assign(product, body);
  await product.save();
  return product;
};

const deleteProduct = async (productId) => {
  const product = await Product.findOne({_id: productId});
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  await product.deleteOne();
  return product;
}

module.exports = {
  createProduct,
  queryProducts,
	getProductByFilter,
  updateProduct,
  deleteProduct,
}
