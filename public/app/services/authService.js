angular.module('authService', [])

// ===================================================
// auth factory to login and get information
// inject $http for communicating with the API
// inject $q to return promise objects
// inject AuthToken to manage tokens
// ===================================================

.factory('Auth', function($http, $q, AuthToken) {
	// create auth factory obj
	var authFactory = {};
	// login user
	authFactory.login = function(username, password) {
		// return promise obj and its data
		return $http.post('/api/authenticate', {
			username: username,
			password: password
		})
		.success(function(data) {
			console.log(data);
			AuthToken.setToken(data.token);
			return data;
		});
	};
	
	// logout user by clearing token
	authFactory.logout = function() {
		AuthToken.setToken();
	};
	
	// check if user is logged in
	// checks for local token
	authFactory.isLoggedIn = function() {
		if (AuthToken.getToken())
			return true;
		else
			return false;
	};
	
	// get logged in user
	authFactory.getUser = function() {
		if (AuthToken.getToken())
			return $http.get('/api/me', { cache : true});
		else
			return $q.reject({ message : 'User has no token.'});
	};
	
	
	
	return authFactory;
})
// ===================================================
// factory for handling tokens
// inject $window to store token client-side
// 
// 
// ===================================================
.factory('AuthToken', function($window) {
	var authTokenFactory = {};
	
	// get token out of local storage
	authTokenFactory.getToken = function() {
		return $window.localStorage.getItem('token');
	};
	// function to set token or clear token
	 // if a token is passed, set the token
	 // if there is no token, clear it from local storage
	 
	 authTokenFactory.setToken = function(token) {
		 if (token)
		 	$window.localStorage.setItem('token', token);
		else
			$window.localStorage.removeItem('token');
	 };
	
	return authTokenFactory;
})
// ===================================================
// application configuration to integrate token into requests
// ===================================================
.factory('AuthInterceptor', function($q, $location, AuthToken) {
	var interceptorFactory = {};
	
	// this will happen on all http requests
	interceptorFactory.request = function(config) {
		// grab token
		var token = AuthToken.getToken();
		// if token exists add it to the header as x-access-token
		if (token)
			config.headers['x-access-token'] = token;
			
			return config;
	};
	
	// happens on response errors
	interceptorFactory.responseError = function(response) {
		// if 403 from server
		if (response.status == 403) {
			AuthToken.setToken();
			$location.path('/login')
		}
		//return the errors from server as promise
		return $q.reject(response);
	};
	
	return interceptorFactory;
});