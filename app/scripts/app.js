'use strict';
/**
 * @ngdoc overview
 * @name mdl-Cab
 * @description
 * # mdl-Cab
 *
 * Main module of the application.
 */
var mdl_app = angular.module('mdl-Cab', [
    'ui.router',
    'ngStorage',
    'appHandler',
    'mdl_directives',
    'integration',
    'ui.select2',
    'ngCookies'
    
]);
mdl_app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('login', {
            url: "/login",
            templateUrl: "views/login/login.html"
        })
        .state('home', {
            url: "/home",
            templateUrl: "views/home.html"
        })
        .state('booking-view', {
            url: "/booking-view",
            templateUrl: "views/booking-view.html"
        })
        .state('newbooking-view', {
            url: "/newbooking",
            templateUrl: "views/newbooking.html"
        })
        .state('edit-booking', {
            url: "/editBooking",
            templateUrl: "views/editBooking-view.html"
                // controller:"editBookingCtrl"
        })
        .state('changePassword', {
            url: "/changePassword-view",
            templateUrl: "views/changePass-view.html"
        });
    $urlRouterProvider.otherwise("login");
});
mdl_app.run(function($rootScope,$timeout,$document,$localStorage,uiSelect2Config){
  uiSelect2Config.placeholder = "Rider's Name";
  $rootScope.$on('$stateChangeSuccess', function () {
    if($('#sidenav-overlay')){
      $('#sidenav-overlay').hide();
    }
  });
  $rootScope.loggedIn = false;
  if($localStorage.userDetail){
    $rootScope.loggedIn = true;
  }

    // Timeout timer value
    var TimeOutTimerValue = 1800000;
    // var TimeOutTimerValue = 5000;

    // Start a timeout

    var TimeOut_Thread = $timeout(function() { LogoutByTimer(); }, TimeOutTimerValue);
    var bodyElement = angular.element($document);

    angular.forEach(['keydown', 'keyup', 'click', 'mousemove', 'DOMMouseScroll', 'mousewheel', 'mousedown', 'touchstart', 'touchmove', 'scroll', 'focus'],
        function(EventName) {
            bodyElement.bind(EventName, function() { TimeOut_Resetter(); });
        });

    function LogoutByTimer() {
        if ($rootScope.loggedIn === true) {
            $('#sessionTimeoutModal').modal('open');
        }
    }
    $rootScope.expireSession = function() {
        $localStorage.$reset();
        $('#sessionTimeoutModal').modal('close');
        //window.location.href = location.origin+'/cab';//for production
        window.location.href = location.origin;
    };

    function TimeOut_Resetter() {
        /// Stop the pending timeout
        $timeout.cancel(TimeOut_Thread);

        /// Reset the timeout
        TimeOut_Thread = $timeout(function() { LogoutByTimer(); }, TimeOutTimerValue);
    }
});
mdl_app.controller('AppController', function($scope, $rootScope, httpPreConfig) {
  console.log(httpPreConfig);
    $rootScope.$on('$stateChangeSuccess', function() {
        if ($('#sidenav-overlay')) {
            $('#sidenav-overlay').remove();
            $('#sidenav-overlay').remove();
        }
    });
    // $(".button-collapse").sideNav();
    $(".button-collapse").sideNav({
        dismissible: false
    });
    defineBroadcastHandlers();

    function defineBroadcastHandlers() {
        var currentHttpCount = 0;
        $scope.$on('HTTP_CALL_STARTED', function() {
            currentHttpCount++;
            $scope.showProgressBar = true;
        });

        $scope.$on('HTTP_CALL_STOPPED', function() {
            currentHttpCount--;
            if (currentHttpCount === 0 || currentHttpCount === -1) {
                $scope.showProgressBar = false;
            }
        });

        $scope.$on('HTTP_ERROR', function(e, info) {
            $scope.openPopup($scope.popupTemplates.systemError);
            $scope.errorInfo = info;
        });

        $scope.$on('SESSION_TIMEDOUT', function(e, info) {
            $scope.errorInfo = info;
        });
    }
})
mdl_app.controller('ChangePasswordController', function($scope, $rootScope, $localStorage, changePasswordDetail) {
    $rootScope.bodyClass = 'bodyBackground';
    var vm = this;
    vm.user = {};
    // $scope.showHeaderOpt = true;
    $scope.headerTitle = 'Change Password';
    $scope.hideMenu = true;
    angular.element('#sidenav-overlay').remove();
    angular.element('#sidenav-overlay').remove();
    angular.element('.drag-target').css('width', '10px');
    vm.user.userId = $localStorage.userDetail.userid;
    vm.resetPass = function() {
        changePasswordDetail(vm.user, function(response) {
            if (response.status == '001') {
                Materialize.toast('Password Successfully Updated!', 1400);
                vm.user = {};
            } else {
                Materialize.toast(response.status_description, 2000);
            }
        })
    }
})
