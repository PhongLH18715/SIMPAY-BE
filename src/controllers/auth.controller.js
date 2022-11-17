const {authService, tokenService} = require('../services');
const catchAsync = require("../utils/catch-async");
const httpStatus = require("http-status");
const login = catchAsync(async (req, res) => {
  const { username, password } = req.body;
  const user = await authService.loginWithUsername(username, password);
  const tokens = await tokenService.generateAuthToken(user, req.body.remember);

  let cookie = req.cookies;
  if (cookie === undefined) {
    res.cookie('refreshToken', tokens['refresh'].token, {
      httpOnly: true,
      expires: new Date(tokens['refresh'].expires)
    }); // add cookie here

    res.cookie('accessToken', tokens['access'].token, {
      httpOnly: true,
      expires: new Date(tokens['access'].expires)
    });
  } else {
    console.log('cookie exists', cookie);
  }

  res.json({ user, tokens });
});

const register = catchAsync(async (req, res) => {
  const user = await authService.register(req.body);
  const tokens = await tokenService.generateAuthToken(user, false);
  let cookie = req.cookies;
  if (cookie === undefined) {
    res.cookie('refreshToken', tokens['refresh'].token, {
      httpOnly: true,
      expires: new Date(tokens['refresh'].expires)
    }); // add cookie here

    res.cookie('accessToken', tokens['access'].token, {
      httpOnly: true,
      expires: new Date(tokens['access'].expires)
    });
  } else {
    console.log('cookie exists', cookie);
  }
  res.json({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  const userId = req.user.id;
  await authService.logout(userId, req.body.refresh_token);
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refresh_token);
  res.send({ ...tokens });
});

module.exports = {
  login,
  register,
  logout,
  refreshTokens
}

