var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testAPIRouter = require("./routes/testAPI");
var addUser = require("./routes/addUser")
var removeUser = require("./routes/removeUser")
var matches = require("./routes/matches")
var addMatch = require("./routes/addMatch")
var removeMatch = require("./routes/removeMatch")
var app = express();

const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors()) // Use this after the variable declaration

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "../client/build")));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);
app.use('/api/users', usersRouter);
app.use("/api/testAPI", testAPIRouter);
app.use("/api/addUser", addUser);
app.use("/api/removeUser",removeUser);
app.use("/api/matches", matches);
app.use("/api/addMatch",addMatch);
app.use("/api/removeMatch", removeMatch);

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

// Serve the React app for any other requests
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

module.exports = app;
