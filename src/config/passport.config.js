const {Strategy: JwtStrategy, ExtractJwt} = require('passport-jwt');
const config = require('./index');
const {tokenTypes} = require('./token.config');
const {User} = require('../models');

const cookieExtractor = req => {
  let jwt = null

  if (req && req.cookies) {
    jwt = req.cookies['jwt']
  }

  return jwt
}

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() /*|| cookieExtractor*/
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    const user = await User.findOne({_id: payload.sub}).populate({path: "role", model: "Role"});
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
