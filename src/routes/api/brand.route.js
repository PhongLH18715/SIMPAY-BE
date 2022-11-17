const express = require('express');
const brandController = require('../../controllers/brand.controller');
const {auth, validation} = require("../../middlewares");
const {brandValidation} = require("../../validations");

const router = express.Router();

router
  .get('/', auth(), validation(brandValidation.getBrands), brandController.getBrands)
  .get('/:brandId', auth(), validation(brandValidation.getBrand), brandController.getBrand)
  .post('/add', auth('MANAGE_ALL_BRAND'), validation(brandValidation.addBrand), brandController.addBrand)
  .post('/update/:brandId', auth('MANAGE_ALL_BRAND'), validation(brandValidation.updateBrand), brandController.updateBrand)
  .post('/delete/:brandId',auth('MANAGE_ALL_BRAND'), validation(brandValidation.deleteBrand), brandController.deleteBrand)

module.exports = router;