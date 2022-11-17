const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const productRoute = require('./product.route');
const brandRoute = require('./brand.route');
const orderRoute = require('./order.route');
const publicRoute = require('./public.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/',
    route: publicRoute,
  },
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/product',
    route: productRoute,
  },
  {
    path: '/brand',
    route: brandRoute,
  },
  {
    path: '/order',
    route: orderRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
