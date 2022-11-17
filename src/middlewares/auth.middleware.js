const passport = require('passport');
const ApiError = require("../utils/api-error");
const httpStatus = require("http-status");
const {PERMISSIONS} = require("../config/role.config");

const verifyCallback = (req, resolve, reject, permissions) => (err, user, info) => {
  if (err || !user || info) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Not authenticated'));
  }
  req.user = user;
  if (permissions.length) {
    const userPermission = PERMISSIONS.get(user.role.name)  /*user.role.permissions*/;
    const hasRequiredPermission = permissions.every(permission => userPermission.includes(permission));
    if (!hasRequiredPermission && req.params.userId !== user.id) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();
}

const authMiddleware = (...permissions) => (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', {session: false}, verifyCallback(req, resolve, reject, permissions))(req, res, next);
  }).then(() => next())
    .catch((err) => next(err));
}

module.exports = authMiddleware;
