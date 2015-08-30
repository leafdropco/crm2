/// call pkgs
var express = require('express'),
	app = express(),
	path = require('path'),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	mongoose = require('mongoose'),
	config = require('./config');
	
	
// APP CONFIG
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

//  configure our app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});
// connect to our database
mongoose.connect(config.database);
// log all requests to the console
app.use(morgan('dev'));
 // set the public folder to serve public assets
app.use(express.static(__dirname + '/public'));
  // set the bower folder to serve public assets
app.use('/bower_components',  express.static(__dirname + '/bower_components'));


// API ROUTES 
var apiRoutes = require('./app/routes/api')(app, express); 
app.use('/api', apiRoutes);


// basic route for home
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});


// START SERVER
app.listen(config.port);