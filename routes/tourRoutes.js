const fs = require('fs');
const express = require('express');
const { Router } = require('express');
const tourController = require('./../controller/tourController');
const authController= require('./../controller/authController')
const router = express.Router();

router
  .route('/top-5-cheap')
  .get(tourController.aliasTop, tourController.getAllTours);
router.route('/tour-stats').get(tourController.getToursStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTours)
  .delete(authController.protect,
     authController.restrictTo('admin', 'guide'), 
     tourController.deleteTours);

module.exports = router;
