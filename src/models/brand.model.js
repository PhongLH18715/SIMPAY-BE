const mongoose = require('mongoose');
const slugify = require("../utils/slugify");
const {toJSON, paginate} = require('./plugins');

const brandSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  thumbnail: {
    type: String
  },
}, {
  collection: 'brands',
  timestamps: true
});

brandSchema.plugin(toJSON);
brandSchema.plugin(paginate);

brandSchema.statics.slugGenerator = async function (brandName) {
  let newSlug = slugify(brandName);
  let count = 0;
  while (await this.exists({ slug: newSlug })) {
    newSlug = `${slugify(brandName)}_${++count}`;
  }
  return newSlug;
};

brandSchema.pre("save", {document: true, query: false}, async function (next) {
  const brand = this;
  if (brand.isModified("name")) {
    brand.slug = await Brand.slugGenerator(brand.name);
  }
  next();
});

brandSchema.pre("deleteOne", {document: true, query: false}, async function (next) {
  const brand = this;
  //
  next();
});

const Brand = mongoose.model(
  'Brand',
  brandSchema
);

module.exports = Brand;
