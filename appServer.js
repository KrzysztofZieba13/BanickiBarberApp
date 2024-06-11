const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const landingPageRouter = require('./routes/landingPageRoutes');
const serviceRouter = require('./routes/serviceRoutes');
const galleryRouter = require('./routes/galleryRoutes');
const ownerRouter = require('./routes/ownerRoutes');
const openHoursRouter = require('./routes/openHoursRoutes');
const viewRouter = require('./routes/viewRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const app = express();

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
  }),
);

const scriptSrcUrls = [
  'https://unpkg.com/',
  'https://tile.openstreetmap.org',
  'https://*.cloudflare.com',
];
const styleSrcUrls = [
  'https://unpkg.com/',
  'https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/',
  'https://tile.openstreetmap.org',
  'https://fonts.googleapis.com/',
];
const connectSrcUrls = [
  'https://unpkg.com',
  'https://tile.openstreetmap.org',
  'https://bundle.js:*',
  'ws://127.0.0.1:*/',
  'https://drkrzysztofzieba.usermd.net',
];
const fontSrcUrls = [
  'https://unpkg.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'data:', 'blob:', 'https:', 'ws:'],
      baseUri: ["'self'"],
      fontSrc: ["'self'", ...fontSrcUrls],
      scriptSrc: ["'self'", 'https:', 'http:', 'blob:', ...scriptSrcUrls],
      frameSrc: ["'self'", 'https://js.stripe.com'],
      objectSrc: ["'none'"],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", 'blob:', 'https://m.stripe.network'],
      childSrc: ["'self'", 'blob:'],
      imgSrc: ["'self'", 'blob:', 'data:', 'https:'],
      formAction: ["'self'"],
      connectSrc: [
        "'self'",
        "'unsafe-inline'",
        'data:',
        'blob:',
        ...connectSrcUrls,
      ],
      upgradeInsecureRequests: [],
    },
  }),
);

// app.use(helmet());
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
console.log(process.env.NODE_ENV);
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Za dużo żądań. Spróbuj ponownie za godzinę.',
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));

//Data sanitizations
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(cookieParser());

app.use('/', viewRouter);
app.use('/api/v1/landingPage', landingPageRouter);
app.use('/api/v1/gallery', galleryRouter);
app.use('/api/v1/service', serviceRouter);
app.use('/api/v1/owner', ownerRouter);
app.use('/api/v1/openHours', openHoursRouter);
app.all('*', (req, res, next) => {
  next(
    new AppError(
      `Nie znaleziono trasy ${req.originalUrl} na tym serwerze!`,
      404,
    ),
  );
});

app.use(globalErrorHandler);

module.exports = app;
