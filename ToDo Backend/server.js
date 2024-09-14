var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mongoose = require('mongoose');
var bluebird = require('bluebird');
var dbconfig = require('./config/database');

// Routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api.route');

var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORS configuration
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

// Route handling
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

// MongoDB setup with Mongoose
mongoose.Promise = bluebird;
mongoose.connect(dbconfig.database, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Successfully connected to MongoDB database at " + dbconfig.database);
		app.listen(3000, () => {
            console.log('Backend server is running on http://localhost:3000');
        });
    })
    .catch(err => {
        console.error("Error connecting to MongoDB database at " + dbconfig.database, err);
    });

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
