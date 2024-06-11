const catchAsync = require('../utils/catchAsync');
const LandingPage = require('../models/landingPageModel');

exports.getOverview = catchAsync(async (req, res, next) => {
  const landingPage = await LandingPage.find().populate({ path: 'openHours' });
  res.status(200).render('overview', { landingPage });
});

exports.getAdmin = catchAsync(async (req, res, next) => {
  const landingPage = await LandingPage.find().populate({ path: 'openHours' });
  res.status(200).render('admin', { landingPage });
});

exports.getEditLandingPage = catchAsync(async (req, res, next) => {
  const landingPage = await LandingPage.find().populate({ path: 'openHours' });
  res.status(200).render('editLandingPage', { landingPage });
});

exports.getEditGallery = catchAsync(async (req, res, next) => {
  const landingPage = await LandingPage.find().populate({ path: 'openHours' });
  res.status(200).render('editGallery', { landingPage });
});

exports.getEditBarberData = catchAsync(async (req, res, next) => {
  const landingPage = await LandingPage.find().populate({ path: 'openHours' });
  res.status(200).render('editBarberData', { landingPage });
});

exports.getEditTablecost = catchAsync(async (req, res, next) => {
  const landingPage = await LandingPage.find().populate({ path: 'openHours' });
  res.status(200).render('editTablecost', { landingPage });
});

exports.getEditOpenHours = catchAsync(async (req, res, next) => {
  const landingPage = await LandingPage.find().populate({ path: 'openHours' });
  res.status(200).render('editOpenhours', { landingPage });
});

exports.getEditMapRoute = catchAsync(async (req, res, next) => {
  const landingPage = await LandingPage.find().populate({ path: 'openHours' });
  res.status(200).render('editMapRoute', { landingPage });
});

exports.getLoginPage = catchAsync(async (req, res, next) => {
  res.status(200).render('login');
});

exports.getForgotPasswordPage = catchAsync(async (req, res, next) => {
  res.status(200).render('forgotpassword');
});

exports.getRenewPasswordPage = catchAsync(async (req, res, next) => {
  res.status(200).render('renewPassword');
});
