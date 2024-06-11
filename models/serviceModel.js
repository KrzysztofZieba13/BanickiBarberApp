const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  titlePL: {
    type: String,
    trim: true,
  },
  titleEN: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    min: 0,
  },
  landingPage: { type: mongoose.Schema.ObjectId, ref: 'LandingPage' },
});

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
