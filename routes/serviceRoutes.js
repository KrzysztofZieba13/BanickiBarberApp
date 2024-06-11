const express = require('express');
const serviceController = require('../controllers/serviceController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(serviceController.getAllServices)
  .post(authController.protect, serviceController.createService);
router
  .route('/:id')
  .patch(authController.protect, serviceController.updateService)
  .delete(authController.protect, serviceController.deleteService);

module.exports = router;
