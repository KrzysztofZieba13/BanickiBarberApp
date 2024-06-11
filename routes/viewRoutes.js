const express = require('express');
const viewController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const landingPageController = require('../controllers/landingPageController');

const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/', landingPageController.getReviews, viewController.getOverview);
router.get('/login', viewController.getLoginPage);

router.get('/admin', authController.protect, viewController.getAdmin);
router.get(
  '/admin/edycja-glowna',
  authController.protect,
  viewController.getEditLandingPage,
);
router.get(
  '/admin/edycja-galeria',
  authController.protect,
  viewController.getEditGallery,
);
router.get(
  '/admin/edycja-dane',
  authController.protect,
  viewController.getEditBarberData,
);
router.get(
  '/admin/edycja-cennik',
  authController.protect,
  viewController.getEditTablecost,
);
router.get(
  '/admin/edycja-godziny',
  authController.protect,
  viewController.getEditOpenHours,
);
router.get(
  '/admin/edycja-mapa',
  authController.protect,
  viewController.getEditMapRoute,
);
router.get('/zapomnialem-hasla', viewController.getForgotPasswordPage);
router.get('/odnow-haslo/:token', viewController.getRenewPasswordPage);

module.exports = router;
