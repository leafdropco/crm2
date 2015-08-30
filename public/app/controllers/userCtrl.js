angular.module('userCtrl', ['userService'])

	.controller('userController', function(User) {
		var vm = this;
		
		// set a processsing variable to show loading things
		vm.processing = true;
		
		// grab all the users at page load
		User.all()
			.success(function(data) {
				// when all users come back, remove proccessing var
				vm.processing = false;
				// bind the users that are returned to vm.users
				vm.users = data;
			});
		// func to delete user	
		vm.deleteUser = function(id) {
			// set a processsing variable to show loading things
			vm.processing = true;
			
			// accepts user id as param
			User.delete(id)
				.success(function(data) {
					User.all()
						vm.processing = false;
						vm.users = data;
				});
		};
	})	
	// controller applied to user creation page
	.controller('userCreateController', function(User) {
		var vm = this;
		
		// variable to hide/show elements of the view
		// differentiates between create or edit pages
		vm.type = 'create';
		
		// func to create user
		vm.saveUser = function() {
			vm.processing = true;
			
			// clear message
			vm.message = '';
			
			// use create function in userService
			User.create(vm.userData)
				.success(function(data) {
					vm.processing = false;
					
					// clear the form
					vm.userData = {};
					vm.message = data.message;
				});
 		};
	})
	// controller applied to user edit page
	.controller('userEditController', function($routeParams, User) {
		var vm = this;
		
		// variable to hide/show elements of the view
		// differentiates between create or edit pages
		vm.type = 'edit';
		
		// get the user data for the user you want to edit
		// $routeParams is the way we grab data from the URL
		User.get($routeParams.user_id)
			.success(function(data) {
				vm.userData = data;
			});
		
		// func to save user
		vm.saveUser = function() {
			vm.processing = true;
			vm.message = '';
			
			// call the userService func to update
			User.update($routeParams.user_id, vm.userData)
				.success(function(data) {
					vm.processing = false;
					
					// clear the form
					vm.userData = {};
					vm.message = data.message;
				});
 		};
	});