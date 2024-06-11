const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const ownerSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    max: 40,
    required: [true, 'Wprowadź swoje imię!'],
  },
  surname: {
    type: String,
    trim: true,
    max: 40,
    required: [true, 'Wprowadź swoje nazwisko!'],
  },
  email: {
    type: String,
    required: [true, 'Wprowadź email'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Wprowadź poprawny adres email'],
  },
  telephoneNumber: {
    type: String,
    trim: true,
    validate: {
      validator: function (val) {
        return validator.isMobilePhone(val);
      },
      message: 'Wprowadź poprawny numer telefonu! (123 456 789)',
    },
    required: [true, 'Wprowadź swój numer telefonu!'],
  },
  address: {
    type: String,
    trim: true,
    max: 200,
    required: [true, 'Wprowadź adres swojego lokalu!'],
  },
  photo: {
    type: String,
    default: 'barber.jpg',
  },
  password: {
    type: String,
    minlength: [8, 'Hasło musi mieć min. 8 znaków'],
    select: false,
    required: [true, 'Wprowadź hasło'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Potwierdź hasło'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Hasła są różne',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

ownerSchema.pre('save', async function (next) {
  // wykonaj tylko gdy hasło było modyfikowane
  if (!this.isModified('password')) return next();

  // haszuj z kosztem 12
  this.password = await bcrypt.hash(this.password, 12);

  //usuń password confirm
  this.passwordConfirm = undefined;
  next();
});

ownerSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

ownerSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

ownerSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const Owner = mongoose.model('Owner', ownerSchema);
module.exports = Owner;
