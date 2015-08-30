angular.module('mainCtrl', [])
.controller('MainController', function($rootScope, $location, Auth) {
	var vm = this;
	
	// get info if a person is logged in
	vm.loggedIn = Auth.isLoggedIn();
	
	// check to see if user is logged in on every req
	$rootScope.$on('$routeChangeStart', function() {
		vm.loggedIn = Auth.isLoggedIn();
		
		// get user info on route change
		// Auth.getUser()
		// .success(function(data) {
		// 	vm.u = data;
		// });
		Auth.getUser().then(function (data) {
     		vm.user = data;
			 console.log(vm.user);
		},
		function (response) {
			// Handle case where user is not logged in
			// or http request fails
		});
	});
	
	// handle login form
	vm.doLogin = function () {
		vm.processing = true;
		// clear error
		vm.error = '';
		
		// call Auth.login() func
		Auth.login(vm.loginData.username, vm.loginData.password)
			.success(function(data) {
				vm.processing = false;
				//if a user logs in, redirect to users pg
				if (data.success)
					$location.path('/users');
				else 
					vm.error = data.message;
				
				
			});
	};
	
	// log out
	vm.doLogOut = function() {
		Auth.logout();
		vm.u = {};
		$location.path('/login');
	};
});