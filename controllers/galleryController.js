const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const { promisify } = require('util');
const Gallery = require('../models/galleryModel');
const LandingPage = require('../models/landingPageModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(new AppError('Można przesyłać tylko zdjęcia!', 400), false);
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.setId = (req, res, next) => {
  req.params.id = '663ccc3f474857eb522481e7';
  next();
};

exports.getGallery = factory.getOne(Gallery);

exports.uploadClientsImages = upload.array('images');

exports.resizeClientImages = catchAsync(async (req, res, next) => {
  // console.log(req.files);
  if (!req.files) return next();

  req.body.images = [];
  await Promise.all(
    req.files.map(async (file, i) => {
      const filename = `client-${Date.now()}-${i + 1}.jpg`;
      await sharp(file.buffer)
        .resize(500, 500)
        .withMetadata()
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/clients/${filename}`);

      req.body.images.push(filename);
    }),
  );

  next();
});

exports.createGallery = catchAsync(async (req, res, next) => {
  const gallery = await Gallery.create(req.body);
  const landingPage = await LandingPage.findOneAndUpdate();
  landingPage.gallery.push(...req.body.images);
  landingPage.save({ validateModifiedOnly: true });

  res.status(201).json({
    status: 'success',
    data: gallery,
  });
});

exports.addToGallery = catchAsync(async (req, res, next) => {
  const gallery = await Gallery.findOneAndUpdate(
    {},
    { $push: { images: req.body.images } },
    { new: true, runValidators: true },
  );

  if (!gallery)
    return next(
      new AppError(
        'Nie znaleziono galerii! Skontaktuj się z administratorem',
        404,
      ),
    );

  res.status(200).json({ status: 'success', data: gallery });
});

exports.removeFromGallery = catchAsync(async (req, res, next) => {
  const { imagesToRemove } = req.body;
  const deletePromises = imagesToRemove.map(async (el) => {
    return promisify(fs.unlink)(`public/img/clients/${el}`);
  });
  await Promise.all(deletePromises);

  const gallery = await Gallery.findOneAndUpdate(
    {},
    { $pull: { images: { $in: imagesToRemove } } },
    { new: true },
  );
  if (!gallery)
    return next(
      new AppError(
        'Nie znaleziono galerii! Skontaktuj się z administratorem',
        404,
      ),
    );

  const landingPage = await LandingPage.findOne();

  landingPage.gallery = gallery.images;
  await landingPage.save({ validateModifiedOnly: true });

  res.status(204).json({ status: 'success', data: null });
});
