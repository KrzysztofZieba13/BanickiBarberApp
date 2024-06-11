const AppError = require('../utils/appError');

const handleDuplicateErrorDb = (err) => {
  const message = `Ta nazwa: ${err.keyValue.name} już istnieje`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Niepoprawnie wprowadzone dane. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleENOENTErrorDB = (err) => {
  const message = `Plik który chcesz usunąć nie istnieje ${err.path}`;
  return new AppError(message, 400);
};

const handleCastErrorDB = (err) => {
  const message = `Błąd ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleMulterError = (err) => {
  const message = `Niepoprawne pole: ${err.field}`;
  return new AppError(message, 400);
};

const handleGeoErrorDB = () => {
  const message =
    'Niepoprawnie wprowadzone współrzędne (lat i lng). Spróbuj ponownie';
  return new AppError(message, 400);
};

const sendErrorDev = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api'))
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  // TODO: make the same for RENDERED WEBSITE
  // B) RENDERED WEBSITE
  // A) Operational, trusted error: send message to the client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Coś poszło nie tak!',
      msg: err.message,
      errorCode: err.statusCode,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      // operational, trusted error

      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // Programming error, don't leak error details
    return res.status(500).json({
      status: 'error',
      message: 'Coś poszło nie tak! Spróbuj ponownie później',
    });
  }
  //TODO: make the same for RENDERED WEBSITE
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Coś poszło nie tak!',
      msg: err.message,
      errorCode: err.statusCode,
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') sendErrorDev(err, req, res);
  else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.name === 'MulterError') error = handleMulterError(error);
    if (error.code === 'ENOENT') error = handleENOENTErrorDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.code === 11000) error = handleDuplicateErrorDb(error);
    if (error.code === 16755) error = handleGeoErrorDB();
    console.log(error);
    sendErrorProd(error, req, res);
  }
};
