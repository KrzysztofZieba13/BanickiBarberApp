const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');
const Email = require('../utils/email');
const Owner = require('../models/ownerModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (owner, statusCode, res) => {
  const token = signToken(owner._id);
  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOption.secure = true;
  res.cookie('jwt', token, cookieOption);

  owner.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      owner,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newOwner = await Owner.create({
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    telephoneNumber: req.body.telephoneNumber,
    address: req.body.address,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  createSendToken(newOwner, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('Wprowadź poprawny email i hasło', 400));

  const owner = await Owner.findOne({ email }).select('+password');

  if (!owner || !(await owner.correctPassword(password, owner.password)))
    return next(new AppError('Niepoprawny adres email lub hasło.', 401));

  createSendToken(owner, 200, res);
});

exports.logout = catchAsync(async (req, res, next) => {
  res.clearCookie('jwt');
  res.status(200).json({ status: 'success' });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    token = req.headers.authorization.split(' ')[1];
  else if (req.cookies.jwt) token = req.cookies.jwt;

  if (!token) {
    return next(new AppError('Brak dostępu. ', 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentOwner = await Owner.findById(decoded.id);
  if (!currentOwner) {
    return next(new AppError('Token należący do właściciela wygasł.', 401));
  }

  if (currentOwner.changedPasswordAfter(decoded.iat))
    return next(new AppError('Właściciel zmienił hasło', 401));

  res.locals.owner = currentOwner;
  req.owner = currentOwner;
  next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const owner = await Owner.findOne({ email: req.body.email });
  if (!owner) return next(new AppError('Niepoprawny email', 404));

  const resetToken = owner.createPasswordResetToken();
  await owner.save({ validateModifiedOnly: true });

  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/odnow-haslo/${resetToken}`;
    await new Email(owner, resetURL).sendPasswordReset();

    res
      .status(200)
      .json({ status: 'success', message: 'Token wysłany na email' });
  } catch (err) {
    owner.passwordResetToken = undefined;
    owner.passwordResetExpires = undefined;
    await owner.save({ validateModifiedOnly: true });
    return next(
      new AppError(
        'Wystąpił błąd podczas wysyłania email. Spróbuj ponownie później'
      ),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const owner = await Owner.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!owner)
    return next(new AppError('Token jest niepoprawny lub wygasł', 400));

  owner.password = req.body.password;
  owner.passwordConfirm = req.body.passwordConfirm;
  owner.passwordResetToken = undefined;
  owner.passwordResetExpires = undefined;
  await owner.save({ validateModifiedOnly: true });

  createSendToken(owner, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const owner = await Owner.findById(req.owner.id).select('+password');

  if (!(await owner.correctPassword(req.body.passwordCurrent, owner.password)))
    return next(new AppError('Wprowadzone hasło jest nieprawidłowe', 401));

  owner.password = req.body.password;
  owner.passwordConfirm = req.body.passwordConfirm;
  await owner.save({ validateModifiedOnly: true });

  createSendToken(owner, 200, res);
});

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) Verify Token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if account exist
      const currentUser = await Owner.findById(decoded.id);
      if (!currentUser) return next();

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // 4) THERE IS A LOGGED USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};
