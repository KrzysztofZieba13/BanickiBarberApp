const mongoose = require('mongoose');

const openHoursSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
  },
  openHour: String,
  closeHour: String,
  isClosed: {
    type: Boolean,
    default: false,
  },
  landingPage: { type: mongoose.Schema.ObjectId, ref: 'LandingPage' },
});

openHoursSchema.index({ name: 1 }, { unique: true });

const OpenHours = mongoose.model('OpenHours', openHoursSchema);
module.exports = OpenHours;
