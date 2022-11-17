const express = require('express');
const productController = require('../../controllers/product.controller');
const {auth, validation, upload} = require("../../middlewares");
const {productValidation} = require("../../validations");

const router = express.Router();

router
  .get('/', auth(), validation(productValidation.getProducts), productController.getProducts)
  .get('/:productId', auth(), validation(productValidation.getProduct), productController.getProduct)
  .post('/add', auth('MANAGE_ALL_PRODUCT'), validation(productValidation.addProduct), productController.addProduct)
  .post('/update/:productId', auth('MANAGE_ALL_PRODUCT'), validation(productValidation.updateProduct), productController.updateProduct)
  .post('/delete/:productId',auth('MANAGE_ALL_PRODUCT'), validation(productValidation.deleteProduct), productController.deleteProduct)

module.exports = router;