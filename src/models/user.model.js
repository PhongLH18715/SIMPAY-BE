const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const {toJSON, paginate} = require("./plugins");
const {default: defaultURL} = require("../config/upload.config");
const fs = require('fs');
const path = require('path');
const Token = require("./token.model");
const Role = require("./role.model");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      }
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error("Password must contain at least one letter and one number");
        }
      },
      private: true // used by the toJSON plugin
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
      private: true
    },
    fullName: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    dob: {
      type: String
    },
    address: {
      type: String
    },
    gender: {
      type: String
    },
    identityNumber: {
      type: String,
      trim: true
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['inactive', 'idle', 'delivering'],
      default: 'inactive'
    },
    avatar: {
      type: String,
      default: defaultURL.url + "avatar.jpg"
    },
  },
  {
    collection: 'users',
    timestamps: true
  }
);

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

userSchema.statics.isUsernameOrEmailTaken = async function (username, email, excludeUserId) {
  const user = await this.findOne({$or: [{username}, {email}], _id: {$ne: excludeUserId}});
  return !!user;
};

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compareSync(password, user.password);
};

userSchema.statics.convertRole = async function (role) {
  return (await Role.findOne({name: role}))._id;
};

// will call before save method => check if password is modified, then hash it
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.role) {
    user.role = (await Role.findOne({name: "user"}))._id
  }
  if (user.isModified("password")) user.password = bcrypt.hashSync(user.password, 8);
  if (user.isModified("avatar") && user.avatar) {
    let avatarPath = path.join(__dirname, '../public', user.avatar.substring(1));
    if (fs.existsSync(avatarPath)) fs.promises.unlink(avatarPath).catch(err => console.log(err));
  }
  next();
});

// will call before remove method => cascading delete all user model references
userSchema.pre("deleteOne", {document: true, query: false}, async function (next) {
  const user = this;
  if (user.avatar) {
    let avatarPath = path.join(__dirname, '../public', user.avatar.substring(1));
    if (fs.existsSync(avatarPath)) fs.promises.unlink(avatarPath).catch(err => console.log(err));
  }
  await Token.deleteMany({user: user._id});
  // await Comment.deleteMany({user: user._id});
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
