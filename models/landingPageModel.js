const mongoose = require('mongoose');
const Service = require('./serviceModel');

const landingPageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      maxLength: [50, 'Tytuł jest za długi. Max 50 znaków.'],
      trim: true,
    },
    description: {
      type: String,
      maxLength: [400, 'Opis jest za długi. Max 400 znaków.'],
      trim: true,
    },
    bookingLink: String,
    services: Array,
    barber: Array,
    location: {
      // GeoJSON
      type: { type: String, default: 'Point', enum: ['Point'] },
      coordinates: [Number],
      routeLink: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

landingPageSchema.index({ location: '2dsphere' });

landingPageSchema.virtual('openHours', {
  ref: 'OpenHours',
  foreignField: 'landingPage',
  localField: '_id',
});

landingPageSchema.pre('save', async function (next) {
  const servicesPromises = this.services.map((id) =>
    Service.findById(id).exec(),
  );
  this.services = await Promise.all(servicesPromises);

  next();
});

const LandingPage = mongoose.model('landingPage', landingPageSchema);

module.exports = LandingPage;
