const mongoose = require('mongoose');
const slugify = require("../utils/slugify");
const { paginate, toJSON } = require("./plugins");

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  slug: {
    type: String
  },
  permissions: [{
    type: String
  }]
});


roleSchema.statics.slugGenerator = async function (roleName) {
  let newSlug = slugify(roleName);
  let count = 0;
  while (await this.exists({ slug: newSlug })) {
    newSlug = `${slugify(roleName)}_${++count}`;
  }
  return newSlug;
};

roleSchema.pre('save', async function (next) {
  const role = this;
  if (role.isModified("name")) {
    role.slug = await Role.slugGenerator(role.name);
  }
  next();
});

roleSchema.plugin(paginate);
roleSchema.plugin(toJSON);

const Role = mongoose.model(
  "Role",
  roleSchema
)

module.exports = Role;