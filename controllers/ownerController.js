const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Owner = require('../models/ownerModel');
const LandingPage = require('../models/landingPageModel');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(new AppError('Można przesyłać tylko zdjęcia', 400), false);
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadOwnerImage = upload.single('photo');

exports.resizeOwnerImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.body.photo = `owner-profile.jpg`;
  await sharp(req.file.buffer)
    .resize(500, 500, { fit: 'inside' })
    .withMetadata()
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/owner/${req.body.photo}`);

  next();
});

exports.setId = (req, res, next) => {
  req.params.id = '664a3b468ea416a6ac65da4c';
  next();
};

exports.getOwner = factory.getOne(Owner);
// exports.updateOwner = factory.updateOne(Owner);
exports.updateOwner = catchAsync(async (req, res, next) => {
  const owner = await Owner.findOneAndUpdate({}, req.body, {
    new: true,
    runValidators: true,
  });

  const landingPage = await LandingPage.findOne();
  landingPage.barber = {
    name: owner.name,
    surname: owner.surname,
    telephoneNumber: owner.telephoneNumber,
    address: owner.address,
    photo: owner.photo,
  };
  landingPage.save({ validateModifiedOnly: true });

  res.status(200).json({
    status: 'success',
    data: owner,
  });
});
