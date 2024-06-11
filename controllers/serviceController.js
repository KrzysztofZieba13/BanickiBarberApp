const Service = require('../models/serviceModel');
const LandingPage = require('../models/landingPageModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.getAllServices = factory.getAll(Service);

exports.createService = catchAsync(async (req, res) => {
  const service = await Service.create(req.body);
  const landingPage = await LandingPage.findOne();
  landingPage.services.push(service._id.toHexString());

  await landingPage.save({ validateModifiedOnly: true });

  res.status(200).json({
    status: 'success',
    data: { service, landingPage },
  });
});

exports.updateService = catchAsync(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  const landingPage = await LandingPage.findOne();
  await landingPage.save();

  res.status(200).json({
    status: 'success',
    data: service,
  });
});

exports.deleteService = catchAsync(async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  const landingPage = await LandingPage.findOne();

  landingPage.services = landingPage.services.filter(
    (serv) => serv._id.toHexString() !== req.params.id,
  );

  await landingPage.save({ validateModifiedOnly: true });

  res.status(200).json({
    status: 'success',
    data: null,
  });
});
