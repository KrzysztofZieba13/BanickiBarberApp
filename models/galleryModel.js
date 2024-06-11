const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  images: [String],
});

const Gallery = mongoose.model('Gallery', gallerySchema);
module.exports = Gallery;
