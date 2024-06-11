const express = require('express');
const galleryController = require('../controllers/galleryController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(galleryController.setId, galleryController.getGallery)
  .patch(
    authController.protect,
    galleryController.uploadClientsImages,
    galleryController.resizeClientImages,
    galleryController.addToGallery,
  )
  .post(
    authController.protect,
    galleryController.uploadClientsImages,
    galleryController.resizeClientImages,
    galleryController.createGallery,
  );

router.patch(
  '/remove',
  authController.protect,
  galleryController.removeFromGallery,
);

module.exports = router;
