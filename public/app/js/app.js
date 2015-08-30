var app = angular.module('userApp', [ 
	'ngAnimate', 'app.routes', 'authService', 'mainCtrl', 'userCtrl', 'userService']);
// app config to integrate token into req
app.config(function($httpProvider) {
	// attach our auth interceptor to the http reqs
	$httpProvider.interceptors.push('AuthInterceptor');
});

app.controller('mainController', function($http) {
	// Bind this to view / vm-view model
	var vm = this;
	
	// define variables and objects on this
	// this lets them be available to our views
	// define a basic variable
	vm.message = 'Hey! Message';
	
	$http.get('/api/users')
	.then(function(data) {
		// bind users to vm.users
		vm.users = data.users;
	});	
});