const express = require('express');
const ownerController = require('../controllers/ownerController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, ownerController.setId, ownerController.getOwner)
  .patch(
    authController.protect,
    ownerController.setId,
    ownerController.uploadOwnerImage,
    ownerController.resizeOwnerImage,
    ownerController.updateOwner,
  );

// router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/odnow-haslo/:token', authController.resetPassword);
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword,
);

module.exports = router;
