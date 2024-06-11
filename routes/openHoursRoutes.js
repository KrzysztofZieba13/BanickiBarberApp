const express = require('express');
const openHoursController = require('../controllers/openHoursController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(openHoursController.getOpenHours)
  .post(openHoursController.createOpenHour);

router
  .route('/:id')
  .patch(openHoursController.updateOpenHour)
  .delete(openHoursController.deleteOpenHour);

module.exports = router;
