const express = require('express');
const userController = require('./../controller/userController');
const router = express.Router();
const authController = require('./../controller/authController');

// user route
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);
router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgetpassword', authController.forgetPassword);
router.patch('/resetpassword/:toekn', authController.resetPassword);

router.route('/').get(userController.getAllUsers).post(userController.getUser);
router
  .route(':id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
