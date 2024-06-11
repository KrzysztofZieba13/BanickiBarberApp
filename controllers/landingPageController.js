const axios = require('axios');
const LandingPage = require('../models/landingPageModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.setId = (req, res, next) => {
  req.params.id = '664f88fe7185730492868e55';
  next();
};

exports.getReviews = catchAsync(async (req, res, next) => {
  const response = await axios({
    method: 'get',
    url: `https://maps.googleapis.com/maps/api/place/details/json?place_id=${process.env.PLACE_ID}&key=${process.env.GOOGLE_API_KEY}&reviews_no_translations=true&fields=reviews`,
    headers: {
      'Accept-Language': 'pl-PL',
    },
  });
  const reviewsArray = response.data.result.reviews;
  const reviews = reviewsArray.map((r) => ({
    authorName: r.author_name,
    text: r.text,
  }));

  res.locals.reviews = reviews;

  next();
});

exports.getLandingPage = factory.getOne(LandingPage, { path: 'openHours' });
exports.createLandingPage = factory.createOne(LandingPage);
exports.updateLandingPage = factory.updateOne(LandingPage);

// exports.updateLandingPage = catchAsync(async (req, res, next) => {
//   const landingPage = await LandingPage.findOneAndUpdate({}, req.body, {
//     runValidators: true,
//     new: true,
//   });

//   if (!LandingPage)
//     return next(new AppError('Nie znaleziono strony głównej', 404));

//   res.status(200).json({
//     status: 'success',
//     data: { data: landingPage },
//   });
// });
