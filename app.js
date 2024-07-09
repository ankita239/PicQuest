var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressSession = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const usersRoute = require('./routes/users'); // Ensure this file exports the necessary functions
require('dotenv').config();

var flash = require('connect-flash');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const port = process.env.PORT || 3000; // Default port if not specified in .env

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET || 'default-secret', // Use a secret from .env if available
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL, // Replace with your MongoDB connection string
    ttl: 365 * 24 * 60 * 60 // Time to live (365 days)
  }),
  cookie: {
    maxAge: 365 * 24 * 60 * 60 * 1000 // 365 days in milliseconds
  }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(usersRoute.serializeUser);
passport.deserializeUser(usersRoute.deserializeUser);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

module.exports = app;
