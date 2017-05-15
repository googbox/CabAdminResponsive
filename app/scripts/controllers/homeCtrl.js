'use strict';

angular.module('mdl-Cab')
  .controller('HomeController',function($rootScope,$localStorage,$scope){
    $rootScope.bodyClass = 'loginBackground';
    var vm  = this;
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
    // Fetching Username
    if($localStorage.userDetail){
      vm.storage = $localStorage.userDetail;
      vm.username = vm.storage.name;
      $rootScope.loggedIn = true;
    }
    $scope.headerTitle = 'Home';
  })
