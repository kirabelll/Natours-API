const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchasync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');
const catchAsync = require('./../utils/catchAsync');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWTSECRETE, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//  send user token

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// user signup
exports.signup = catchasync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newUser, 201, res);
});
// User Login
exports.login = catchasync(async (req, res, next) => {
  const { email, password } = req.body;
  // if check email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  // check if user exist
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or passaword', 401));
  }
  createSendToken(user, 200, res);
});

exports.protect = catchasync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWTSECRETE);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

// restrict
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('Your do not permission to preform this action ', 403)
      );
    }
    next();
  };
};

exports.forgetPassword = catchasync(async (req, res, next) => {
  // get user based on Postid
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('this is no user with email address', 404));
  }
  // generating token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  console.log(resetToken);
  // send it to user email
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/forgetpassword/${resetToken}`;

  const message = `Forget your password? submit a patch request with your new password and passwordConfirm to ${resetUrl}. \n 
  If you did't forget your password, please ignore this email`;
  await sendEmail({
    email: user.email,
    subject: 'Your password reset token (vaild for 10 main) ',
    message,
  });
  rs.status(200).json({
    status: ' success',
    message: 'Token sent to email!',
  });
});

exports.resetPassword = catchasync(async (req, res, next) => {
  // get the user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    PasswordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // if token  has not expried  and there is user , set the new password

  if (!user) {
    return next(new AppError('Token id invlid or has expried', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //  get user fro collaction
  const user = await User.findById(req.user.id).select('+password');

  // check if postID current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your currrent password is wrong', 401));
  }
  // if so update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // log user in send jwt
  createSendToken(user, 200, res);
});