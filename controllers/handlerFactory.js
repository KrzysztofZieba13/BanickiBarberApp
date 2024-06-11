const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { data: doc },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    let updateFields = {};

    if (req.body.location) {
      if (req.body.location.coordinates) {
        updateFields['location.coordinates'] = req.body.location.coordinates;
      }
      if (req.body.location.routeLink) {
        updateFields['location.routeLink'] = req.body.location.routeLink;
      }
    } else updateFields = req.body;

    const doc = await Model.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!doc)
      return next(
        new AppError('Nie znaleziono dokumentu o takim identyfikatorze', 404),
      );
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc)
      return next(
        new AppError('Nie znaleziono dokumentu o takim identyfikatorze', 404),
      );

    res.status(200).json({
      status: 'success',
      data: null,
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc)
      return next(
        new AppError('Nie znaleziono dokumentu o takim identyfikatorze', 404),
      );
    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.find();

    if (!doc) return next(new AppError('Nie znaleziono dokumentu ', 404));

    res.status(200).json({
      status: 'success',
      length: doc.length,
      data: {
        data: doc,
      },
    });
  });
