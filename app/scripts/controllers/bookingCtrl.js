'use strict';

angular.module('mdl-Cab')
    .controller('BookingController',function($localStorage, $state, getBookingDetails, $scope, cancelBooking, viewIndBooking, $rootScope) {
      
      
      $rootScope.bodyClass = 'bodyBackground';
      $(document).ready(function(){
          $(".button-collapse").sideNav();
          $('ul.tabs').tabs();
        	$('.modal').modal();
          
      	});

      
        Date.prototype.format = function() {
            var day = ("0" + this.getDate()).slice(-2);
            var month = ("0" + (this.getMonth() + 1)).slice(-2);
            var year = this.getFullYear();
            return year + '-' + month + '-' + day;
        };
        var vm = this;
        vm.upcomingBookingDetailsData = [];
        vm.pastBookingDetailsData = [];
        // var bookingTime = [];
        if ($localStorage.userDetail) {
            vm.storage = $localStorage.userDetail;
        }
        vm.hasBookings = true;
        vm.hasPastBookings = true;
        vm.hasUpcomingBookings = true;
        $scope.headerTitle = "Manage Bookings";
        $scope.hideMenu = true;
        $scope.showHeaderOpt = false;
        var reqObj = {};
        if (vm.storage) {
            reqObj.userid = vm.storage.userid;
        }
        // var currTime = new Date().getTime();
        $(".button-collapse").sideNav('hide');
        $scope.getAllBookings = function() {
            getBookingDetails(reqObj, function(response) {
                if (response && response.length) {
                    vm.bookDetailsData = response.reverse();
                    if(vm.bookDetailsData.length === 0){
                      vm.hasPastBookings = false;
                    }else{
                      vm.hasPastBookings = true;
                    }
                    // for(var i=0;i<vm.bookDetailsData.length;i++){
                    //   bookingTime[i] = new Date(vm.bookDetailsData[i].travel_from_date.split(' (')[0]+ ' '+vm.bookDetailsData[i].travel_pickup_time).getTime();
                    //   if(bookingTime[i] >= currTime){
                    //     vm.upcomingBookingDetailsData.push(vm.bookDetailsData[i]);
                    //   }else{
                    //     vm.pastBookingDetailsData.push(vm.bookDetailsData[i]);
                    //   }
                    // }
                    // if(vm.pastBookingDetailsData.length === 0){
                    //   vm.hasPastBookings = false;
                    // }else{
                    //   vm.hasPastBookings = true;
                    // }
                    // if(vm.upcomingBookingDetailsData.length === 0){
                    //   vm.hasUpcomingBookings = false;
                    // }else{
                    //   vm.hasUpcomingBookings = true;
                    // }
                    updatePastBookings(vm.bookDetailsData);
                } else if (response.id == 'undefined') {
                    $state.go('login');
                } else {
                    vm.hasBookings = false;
                    console.log("data not found");
                }
            },function(error){
              console.log(error);
            })
        }
        $scope.getAllBookings();

        function updatePastBookings(bookingDetails) {
            bookingDetails.forEach(addFlag);
        }

        function addFlag(element) {
            var travel_from_date = new Date(element.travel_from_date).format();
            if (new Date(travel_from_date + ' ' + element.travel_pickup_time + ':00') < new Date()) {
                element.pastBooking = true;
            }
        }
        vm.editBooking = function(bookingId) {
            $rootScope.editbookingId = bookingId;
            $state.go('edit-booking');
        }

        vm.cancelBooking = function(bookingId) {
            reqObj.id = bookingId;
            cancelBooking(reqObj, function(response) {
                if (response.status == "001") {
                    Materialize.toast('Request Cancelled !', 1400);
                    $scope.getAllBookings();
                    $state.reload();
                } else {
                    Materialize.toast('Request Cancelled !', 1400, function() {
                        $scope.getAllBookings();
                    });

                }
            })

        }

        vm.signOut = function() {
            angular.element('#sidenav-overlay').remove();
            $state.go('login');
            $localStorage.$reset();
            // signOut({vm.storage.sessionId},function(){
            //    if(response.status == '00'){
            //      $state.go('login');
            //      $localStorage.$reset();
            //    }
            // })

        }
        vm.openCancelBooking = function(bookingId){
          vm.bookingId = bookingId;
          $('#modal2').modal('open');
        }

        vm.split = function(code){
          if(code){
            return code.split('-')[0];
          }
        }
        vm.currentTime = new Date();
        var start_time = new Date();
        vm.isGarageClosed = function(date,time,status){
          time = time.split(':')[0]+':'+time.split(':')[1]
          start_time = new Date(date+" "+time+':00');
          if(status == 'Allocated'){
            if((start_time.getTime()-vm.currentTime.getTime())/(60*1000) <= 60){
              return true;
            }
            else{
              return false;
            }
          }else{
            return false;
          }
        }
        
    })
    .filter('formatDate', function($filter) {
        return function(input) {
            var output = input.split(' (')[0];
            output = $filter('date')(new Date(output), "EEEE, dd MMM yyyy,");
            return output;
        }
    })
    .filter('capitalize', function() {
      return function(input, all) {
        var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
        return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
      }
    })
    .filter('timeConvert',function(){
      return function(input){
        return convertTime(input);
      }
    })
    .filter('checkSelf',function($localStorage){
      return function(name){
        if($localStorage.userDetail.name == name){
          return 'Self';
        }else{
          return name;
        }
      }
    })
    .filter('timeFormat', function() {
        return function(date) {
            var mask = new Date(date);
            return ((mask.getHours() < 10 ? '0' : '') + mask.getHours()) + ':' + ((mask.getMinutes() < 10 ? '0' : '') + mask.getMinutes());
        }
    });
    // Convert time Func
    var convertTime = function(timeToConvert) {
          timeToConvert = timeToConvert.split(':')[0]+':'+timeToConvert.split(':')[1];
          if (parseInt(timeToConvert.split(':').join('')) >= 1200 && parseInt(timeToConvert.split(':').join('')) < 2400) {
              // PM slot
              if (timeToConvert.split(':')[0] >= 12) {
                  if (timeToConvert.split(':')[0] > 12) {
                      timeToConvert = ('' + timeToConvert.split(':')[0] % 12 + ':' + timeToConvert.split(':')[1] + ' PM');
                  } else {
                      timeToConvert = ('' + timeToConvert.split(':')[0] + ':' + timeToConvert.split(':')[1] + ' PM');
                  }
              }
          } else if (parseInt(timeToConvert.split(':').join('')) > 1200 && parseInt(timeToConvert.split(':').join('')) >= 2400) {
              // AM slot
              timeToConvert = ('' + timeToConvert.split(':')[0] % 12 + ':' + timeToConvert.split(':')[1] + ' AM');
          } else {
              // AM slot
              timeToConvert = ('' + timeToConvert.split(':')[0] + ':' + timeToConvert.split(':')[1] + ' AM');
          }
          return timeToConvert;
      }

  // Convert time Func => END
