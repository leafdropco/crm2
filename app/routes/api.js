var jwt = require('jsonwebtoken'),
	config = require('../../config'),
	superSecret = config.secret,
	U = require('../models/user'),
	User = new U();
	
	// ROUTES FOR API
	
module.exports = function(app, express) {
	// get an instance of the express router
	var apiRouter = express.Router();

	// MW Using JWT to auth 
	apiRouter.post('/authenticate', function(req, res) {
		// find user
		// select the name username and pass explicitly
		U.findOne({
			username: req.body.username
		}).select('name username password').exec(function(err, user) {
			if (err) throw err;
			
			// no user with that username was found
			if (!user) {
				res.json({
					success : false,
					message : 'no user with that username was found'
				});
			} else if (user) {
				
				// check is pass matches
				var validPassword = user.comparePassword(req.body.password);
				if (!validPassword) {
					res.json({
						success : false,
						message : 'Authentication failed. Wrong password.'
					});
				} else {
					
					// if user is found & pass is correct
					// create a token
					var token = jwt.sign({
						name : user.name,
						username : user.username
					}, superSecret, {
						expiresInMinutes: 1440 // 24hrs
					});
					
					// return the info including token as json
					res.json({
						success : true,
						message : 'Enjoy Token!',
						token : token
					});
				}
			}
		});
	});
	
	
	// MW for all reqs
	apiRouter.use(function(req, res, next) {
		console.log('someone came to our app');
		
		// Auth will go here
		var token = req.body.token || req.query.token || req.headers['x-access-token'];
		
		// decode token
		if (token) {
			// verify secret and checks expiration
			jwt.verify(token, superSecret, function(err, decoded) {
				if (err) {
					return res.status(403).send({
						success : false,
						message : 'Failed to Authenticate Token.'
					});
				} else {
					req.decoded = decoded;
					
					next();
				}
			});
		} else {
			// if there is no token
			// return an http response of 403 (access forbidden) & an err msg
			return res.status(403).send({
				success : false,
				message : 'No token provided'
			});
		}
	});
	
	// test route to make sure everything is working
	// accessed at GET http://localhost:8080/api
	app.use('/api', apiRouter); //root
	
	apiRouter.get('/', function(req, res){
		res.json({ message : 'welcome to our api!'});
	});
	
	
	
	
	// on routes that end in /users
	// ----------------------------------------------------
	apiRouter.route('/users')
	
		// create user 
		.post(function(req, res) {
			// create a new instance of the User model
			var user = new U();
			
			// set the users information (comes from the request)
			user.name = req.body.name;
			user.username = req.body.username;
			user.password = req.body.password;
			
			// save user and check for errors
			user.save(function(err) {
				if (err) {
					// Duplicate Entry
					if (err.code == 11000)
						return res.json({ success : false, message : 'A user with that username already exists.'
						});
					else 
						return res.send(err);
				}
				res.json({ message : 'User Created!'});
			});
		})
		.get(function(req, res) {
				U.find(function(err, users) {
					if (err){
						res.send(err);	
					}
					else{
						// return users
						res.json(users);
					}
				});
			});
	
	
	
	
	
	
	// on routes that end in /users/:user_id
	// ----------------------------------------------------
	apiRouter.route('/users/:user_id')
		// get the user with that id
		// (accessed at GET http://localhost:8080/api/users/:user_id)
		.get(function(req, res) {
			U.findById(req.params.user_id, function(err, user) {
				if (err) res.send(err);
				
				// return  that user
				res.json(user);
			});
		})
		
		// update the user with this id
		// (accessed at PUT http://localhost:8080/api/users/:user_id)
		.put(function(req, res) {
			// use our user model to find the user we want
			U.findById(req.params.user_id, function(err, user) {
				if (err) res.send(err);
				
				// update user info only if its new
				if (req.body.name) user.name = req.body.name;
				if (req.body.username) user.username = req.body.username;
				if (req.body.password) user.password = req.body.password;
				
				// save user
				user.save(function(err) {
					if (err) res.send(err);
					
					// return a message
					res.json({message : 'User Updated!'});
				});
			});	
		})
		
		// delete the user with this id
		// (accessed at DELETE http://localhost:8080/api/users/:user_id)
		.delete(function(req, res) {
			U.remove({
				_id: req.params.user_id
			}, function(err, user) {
				if (err) return res.send(err);
				
				res.json({ message : 'Successsfully Deleted'});
			});
		});
	
	apiRouter.get('/me', function(req, res) {
		res.send(req.decoded);
	});
	
	return apiRouter;
}