const OpenHours = require('../models/openHoursModel');
const factory = require('./handlerFactory');

exports.createOpenHour = factory.createOne(OpenHours);
exports.getOpenHours = factory.getAll(OpenHours);
exports.updateOpenHour = factory.updateOne(OpenHours);
exports.deleteOpenHour = factory.deleteOne(OpenHours);
