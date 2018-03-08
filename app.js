var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
const PATH = require('path');
const port = process.env.PORT || 3000; 
var MongoStore = require('connect-mongo')(session);

//connect to MongoDB

// mongoose.connect('mongodb://localhost/testForAuth');
// var db = mongoose.connection;

//   var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/testForAuth";
//   var PORT = process.env.MONGODB_URI || 3000; 
//     // Set mongoose to leverage built in JavaScript ES6 Promises
//   // Connect to the Mongo DB
//   mongoose.Promise = Promise;
//   mongoose.connect(MONGODB_URI, {
//     useMongoClient: true
//   });
mongoose.connect('mongodb://localhost/testForAuth');
var db = mongoose.connection;

//handle mongo error
// MONGODB_URI.on('error', console.error.bind(console, 'connection error:'));
// MONGODB_URI.once('open', function () {
//   // we're connected!
// });

//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// serve static files from template
app.use(express.static(__dirname + '/templateLogReg'));

// include routes
var routes = require('./routes/router');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});


// listen on port
app.listen(port, () => {
  console.log("Listening on port:", port);
});