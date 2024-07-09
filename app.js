var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressSession = require('express-session');
const passport = require('passport');
const usersRoute = require('./routes/users');
const MongoStore = require('connect-mongo');
require('dotenv').config();



var flash = require('connect-flash');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());
app.use(expressSession({
  resave:false,
  saveUninitialized:false,
  secret : "hey hey hey",
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

passport.serializeUser(usersRoute.serializeUser());
passport.deserializeUser(usersRoute.deserializeUser());


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
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

module.exports = app;
