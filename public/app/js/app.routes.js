angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {
	$routeProvider
		//home page route
		.when('/', {
			templateUrl : 'app/views/pages/home.html'
		})
		// login route
		.when('/login', {
			templateUrl : 'app/views/pages/login.html',
			controller : 'MainController',
			controllerAs : 'login'
		})
		// users route
		.when('/users', {
			templateUrl : 'app/views/pages/users/all.html',
			controller : 'userController',
			controllerAs : 'user'
		})
		// create users route
		.when('/users/create', {
			templateUrl : 'app/views/pages/users/single.html',
			controller : 'userCreateController',
			controllerAs : 'user'
		})
		// edit users route
		.when('/users/:user_id', {
			templateUrl : 'app/views/pages/users/single.html',
			controller : 'userEditController',
			controllerAs : 'user'
		});
		
	// get rid of the hash in the url
	$locationProvider.html5Mode(true);
});