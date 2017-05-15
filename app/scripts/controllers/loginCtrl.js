'use strict';

angular.module('mdl-Cab')
.controller('LoginController',['verifyUserData','$state','$scope','$rootScope','$localStorage','httpPreConfig','generatePassword','$cookies',function(verifyUserData,$state,$scope,$rootScope,$localStorage,httpPreConfig,generatePassword,$cookies){
	$rootScope.bodyClass = 'loginBackground';
	var reqObj = {};
	var vm = this;
	vm.username = '';
	vm.password = '';
	vm.rememberme = true;
	vm.showWarning = false;
	vm.showLoginError = false;
	$(document).ready(function(){
    	$('.modal').modal();
  	});
		// Greeting Text
    var myDate = new Date();
    var hrs = myDate.getHours();
		if (hrs < 12){
      vm.greetingText = 'Good Morning';
    }
    else if (hrs >= 12 && hrs <= 17){
        vm.greetingText = 'Good Afternoon';
    }
    else if (hrs >= 17 && hrs <= 24){
      vm.greetingText = 'Good Evening';
    }
  	if($localStorage.userDetail !== undefined){
	 		$state.go('home');
	 	}


	  if($cookies.get('username') && $cookies.get('password')){
	    vm.username = $cookies.get('username');
	    vm.password = $cookies.get('password');
	  }
	  vm.rememberUser = function(){
	    if(vm.rememberme === true){
	      $cookies.put('username', vm.username,{path : '/'});
	      $cookies.put('password', vm.password,{path : '/'});
	    }else{
	      $cookies.remove('username',{path : '/'});
	      $cookies.remove('password',{path : '/'});
	    }
	  }


	 vm.verifyUser = function(){
	 	if(!vm.username && !vm.password){
	 		vm.showLoginError = true;
	 		return;
	 	}

	 	reqObj.userid = vm.username;
	 	reqObj.password = vm.password;
		verifyUserData(reqObj,function(response){
			 //$localStorage.userDetail = response;
			// vm.rememberUser();
			// $state.go('home');
			console.error(response);
			
			if(response.status == '001'){
				$localStorage.userDetail = response;
				vm.rememberUser();
				// $rootScope.loggedIn = true;
				$state.go('home');
			}else{
				vm.showWarning = true;
			}
		},function(error){
			console.log(error);
			vm.showWarning = true;
		});
	};
	vm.forgetPassword = function(){
			if(vm.fmno === undefined){
				vm.errorMsg = 'Please enter FMNO';
			}
			else{
				generatePassword(vm.fmno,function(response){
					if (response.status == "001") {
						$('#modal1').modal('close');
						vm.fmno = '';
						Materialize.toast(response.status_description, 3100);
					}else{
						vm.errorMsg = response.status_description /*Materialize.toast(response.status_description, 2000);*/
					}
				});
			}
	};
}]);
