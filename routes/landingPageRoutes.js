const express = require('express');
const landingPageController = require('../controllers/landingPageController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(landingPageController.setId, landingPageController.getLandingPage)
  .post(authController.protect, landingPageController.createLandingPage)
  .patch(
    authController.protect,
    landingPageController.setId,
    landingPageController.updateLandingPage,
  );

module.exports = router;
