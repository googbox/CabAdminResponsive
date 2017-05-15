'use strict';

angular.module('mdl-Cab')
    .controller('EditBookingController', function($state, $scope, $localStorage, viewIndBooking, $rootScope, getCities, getEmployeeDetail, updateBookingDetail) {
      $(document).ready(function(){
        $('#timepicker').pickatime({
          twelvehour: false
        });
        $('.datepicker').pickadate({
         selectMonths: true, // Creates a dropdown to control month
         selectYears: 15, // Creates a dropdown of 15 years to control year
         format: 'yyyy-mm-dd'
        });
        document.getElementById("timepicker").type="time";
        if(navigator.userAgent.indexOf("Firefox") != -1 ){
          document.getElementById("timepicker").value = document.getElementById("timepicker").value.slice(0,5)
        }
      })
      var loadpickupflag = true;
      var loaddropofflag = true;
        $rootScope.bodyClass = 'bodyBackground';
        var vm = this;
        vm.bookingData = {};
        vm.pickupType = [{
            "pType": "4",
            "value": "true"
        }, {
            "pType": "6",
            "value": "false"
        }, {
            "pType": "8",
            "value": "false"
        }, {
            "pType": "12",
            "value": "false"
        }, {
            "pType": "Outstation",
            "value": "false"
        }];
        $scope.headerTitle = "Edit Cab Booking";
        $scope.hideMenu = true;
        // vm.bookingData.travel_pickup_point_addr1 = '';
        // vm.bookingData.travel_drop_point_addr1 = '';
        vm.showPickupField = false;
        vm.showDropoffField = false;
        vm.showPickupFlightDetails = false;
        vm.showDropoffFlightDetails = false;
        Materialize.updateTextFields();
        $scope.showHeaderOpt = true;
        $(document).ready(function() {
            $(".button-collapse").sideNav();
        })
        vm.storage = $localStorage.userDetail;
        vm.bookingDetail = {};
        vm.forDate = {
            value: new Date(2015, 3, 22),
            currentDate: new Date()
        };

        var currDate = new Date();
        vm.DateEnable = true;

        getEmployeeDetail({}, function(response) {
            vm.requseter = response;
            // if($rootScope.editbookingId == 'undefined'){
            //     $state.go("booking-view");
            // }else{
                viewIndBooking($rootScope.editbookingId, function(response) {
                    if (response) {
                        vm.bookingData = response[0];
                        console.log(vm.bookingData);console.log('asdf');
                        vm.bookingData.charge_type = vm.bookingData.charge_type;
                        vm.bookingData.Drop_location = vm.bookingData.Drop_location;
                        vm.bookingData.mobile_no = vm.bookingData.mobile_no;
                        vm.bookingData.travelfrom_date = new Date(vm.bookingData.travel_from_date);
                        vm.bookingData.travelto_date = new Date(vm.bookingData.travel_to_date);
                        vm.bookingData.pickupTime = vm.stringToDate(vm.bookingData.travel_from_date, "dd-MM-yyyy", "-", vm.bookingData.travel_pickup_time);

                        vm.bookingData.travel_pickup_point_addr1 = vm.bookingData.travel_pickup_point_addr1;
                        vm.bookingData.travel_drop_point_addr1 = vm.bookingData.travel_drop_point_addr1;
                        // vm.bookingData.pickupTime = vm.stringToDate(vm.bookingData.travel_from_date, "dd-MM-yyyy", "-", vm.bookingData.travel_pickup_time);
                        vm.bookingData.request_raised_for = vm.getrequesterName(vm.bookingData.request_raised_for);
                        if (vm.bookingData.car_class_rmk == 'undefined') {
                            vm.bookingData.car_class_rmk = '';
                        }
                        vm.updateCity();
                        $('.select2-chosen').html(vm.bookingData.name);
                        getCities(vm.bookingData.request_raised_for.empl_cd, function(response) {
                            vm.pickupCity = response.city;
                            vm.selectPickupLocation(vm.bookingData.pickup_location);
                            vm.populateOtherPickupField();
                            vm.populateOtherDropField();
                            vm.checkAirportPickup();
                            vm.checkAirportDropoff();
                        });

                    }
                });
            //}
        });
        setInterval(function(){
          if(navigator.userAgent.indexOf("Firefox") != -1 ){
            $('#timepicker').val($('#timepicker').val().slice(0,5));
          }
        },2000);


        // vm.resetOtherPickupField = function(){
        //   if(vm.split(vm.bookingData.pickup_point_code) != 'OTHER'){
        //     vm.bookingData.travel_pickup_point_addr1 = '';
        //   }
        // }
        // vm.resetOtherDropField = function(){
        //   if(vm.split(vm.bookingData.drop_point_code) != 'OTHER'){
        //     vm.bookingData.travel_drop_point_addr1 = '';
        //   }
        // }


        vm.selectPickupLocation = function(cityName) {
            vm.showPickupFlightDetails = false;
            angular.forEach(vm.pickupCity, function(val, key) {
                if (vm.pickupCity[key].code == cityName) {
                    vm.pickupLocat = vm.pickupCity[key].pickup_code;
                    vm.dropupLocat = vm.pickupCity[key].pickup_code;

                }
            })
        };

        vm.changedBookingFor = function() {
            vm.bookingData.travel_guests1_mobile_no = vm.bookingData.request_raised_for.mobile_no;
            
            vm.pickupCity = "";
            vm.pickup_point_code = "";
            vm.showPickupField = false;
            vm.pickupLocat = "";
            vm.dropupLocat = "";
            vm.bookingDetail.pickup_flight_details = "";
            vm.showPickupFlightDetails = false;
            vm.bookingDetail.dropoff_flight_details = "";
            vm.showDropoffFlightDetails = false;
            getCities(vm.bookingData.request_raised_for.empl_cd, function(response) {
             
                        vm.pickupCity = response.city;
                        vm.selectPickupLocation(vm.bookingData.pickup_location);
                        vm.populateOtherPickupField();
                        vm.populateOtherDropField();
                        vm.checkAirportPickup();
                        vm.checkAirportDropoff();
                    });

              //vm.pickupType = response.data.TYPE_TRAVEL;
           


        };

        vm.getrequesterName = function(empId) {
            var empName;
            angular.forEach(vm.requseter, function(val, key) {
                if (vm.requseter[key].empl_cd == empId) {
                    // empName = vm.requseter[key].name;
                    empName = vm.requseter[key];
                }
                return;
            })
            return empName;
        };
        vm.stringToDate = function(_date, _format, _delimiter, time) {
            // var formatLowerCase = _format.toLowerCase();
            // var formatItems = formatLowerCase.split(_delimiter);
            // var dateItems = _date.split(_delimiter);
            // var monthIndex = formatItems.indexOf("mm");
            // var dayIndex = formatItems.indexOf("dd");
            // var yearIndex = formatItems.indexOf("yyyy");
            // var month = parseInt(dateItems[monthIndex]);
            // month -= 1;
            // var timeArray = time.split(':')
            // var formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex], timeArray[0], timeArray[1]);
            var dateItems = new Date(_date).withoutTime().toString().split('00')[0];
            var formatedDate = new Date(dateItems+time);
            return formatedDate;
        };
        vm.updateCity = function() {
            getCities(vm.bookingData.request_raised_for.empl_cd, function(response) {
                vm.pickupCity = response.city;
                angular.forEach(vm.pickupCity, function(val, key) {
                    if (vm.pickupCity[key].code == vm.bookingData.Drop_location) {
                        vm.pickupLocat = vm.pickupCity[key].pickup_code;
                        vm.dropupLocat = vm.pickupCity[key].pickup_code;
                        return;
                    }
                    //vm.bookingData.pickup_point_code = vm.bookingData.pickup_point_code;
                    //vm.bookingData.drop_point_code = vm.bookingData.drop_point_code;
                })
                vm.bookingData.pickup_point_code = vm.bookingData.pickup_point_code;
                
                vm.bookingData.drop_point_code = vm.bookingData.drop_point_code;
               
                    


            })
        };

        vm.updateBooking = function() {
            vm.bookingData.userid = vm.storage.userid;
            vm.bookingData.request_raisedfor = vm.getrequesterID(vm.bookingData.request_raised_for);
            vm.bookingData.travelfrom_date = new Date().format(vm.bookingData.travelfrom_date);
            vm.bookingData.travelto_date = new Date().format(vm.bookingData.travelto_date);
            vm.bookingData.pickupTime = vm.bookingData.pickupTime.getHours() + ':' + vm.bookingData.pickupTime.getMinutes();

            vm.bookingData.travel_pickup_point_addr1 = (vm.bookingData.travel_pickup_point_addr1===undefined)?'':vm.bookingData.travel_pickup_point_addr1;

            vm.bookingData.travel_drop_point_addr1 = (vm.bookingData.travel_drop_point_addr1===undefined)?'':vm.bookingData.travel_drop_point_addr1;

            vm.bookingData.pickup_flight_details = (vm.bookingData.pickup_flight_details===undefined)?'':vm.bookingData.pickup_flight_details;

            vm.bookingData.dropoff_flight_details = (vm.bookingData.dropoff_flight_details===undefined)?'':vm.bookingData.dropoff_flight_details;

            updateBookingDetail(vm.bookingData, function(response) {
                if (response.status == '001') {
                    Materialize.toast(response.status_description, 1400);
                    $state.go('booking-view');
                } else {
                    Materialize.toast(response.status_description, 2000);
                }
            })
        };
        vm.getrequesterID = function(empName) {
            angular.forEach(vm.requseter, function(val, key) {
                if (vm.requseter[key].name == empName.name) {
                    empName = vm.requseter[key].empl_cd;
                }
            })
            return empName;
        };

        vm.validateToDate = function validateToDate() {
            if (vm.bookingData.travelto_date !== 'undefined') {
                if (vm.bookingData.travelfrom_date > vm.bookingData.travelto_date) {
                    vm.bookingData.travelto_date = vm.bookingData.travelfrom_date;
                    Materialize.toast('To date cannot be less than from date', 2000);
                }
            } else {
                vm.bookingData.travelto_date = vm.bookingData.travelfrom_date;
            }
        };

        vm.validateTime = function() {
            currDate = new Date();
            currDate.setSeconds(0);
            currDate.setMilliseconds(0);

            if (vm.bookingData.travelfrom_date !== 'undefined') {
                var selectedPickupDate = new Date(vm.bookingData.travelfrom_date);
                var selectedStartTime = new Date(vm.bookingData.pickupTime);
                var pickupAt = getPickupAt(selectedPickupDate, selectedStartTime);

                if (pickupAt >= currDate) {
                    return vm.DateEnable;
                } else {
                    vm.bookingData.pickupTime = currDate;
                    vm.DateEnable = false;
                    Materialize.toast('Bookings cannot be created for already passed start time', 2000);
                    return vm.DateEnable;
                }
            }
        };

        function getPickupAt(pickupDate, pickupTime) {
            var date = pickupDate.getDate();
            var month = pickupDate.getMonth();
            var year = pickupDate.getFullYear();

            var hour = pickupTime.getHours();
            var min = pickupTime.getMinutes();

            var pickup = new Date(year, month, date, hour, min);

            return pickup;
        }

        Date.prototype.withoutTime = function () {
            var d = new Date(this);
            d.setHours(0, 0, 0, 0);
            return d;
        }

        var dateFormat = function(mask) {
          var day = ("0" + mask.getDate()).slice(-2);
          var month = ("0" + (mask.getMonth() + 1)).slice(-2);
          var year = mask.getFullYear();
          return year + '-' + month + '-' + day;
        }
        Date.prototype.format = function(date) {
          return dateFormat(date);
        };

        // vm.split = function(code){
        //   if(code){
        //     return code.split('-')[0];
        //   }
        // }

        vm.populateOtherPickupField = function(){
            if(loadpickupflag === false){
                vm.bookingData.pickup_flight_details = "";
                //vm.bookingData.dropoff_flight_details = "";
            }else{
                loadpickupflag = false;
            }
            
          if(vm.bookingData.pickup_point_code){
            for(var i=0;i<vm.pickupLocat.length;i++){
              if(vm.pickupLocat[i].pickup_id == vm.bookingData.pickup_point_code){
                if(vm.bookingData.pickup_point_code.split('-')[0] == "OTHER"){
                  vm.bookingData.travel_pickup_point_addr1 = vm.bookingData.travel_pickup_point_addr1;
                }
                else{
                    if(vm.bookingData.travel_pickup_point_addr1 != ""){
                        vm.bookingData.travel_pickup_point_addr1 = vm.bookingData.travel_pickup_point_addr1;
                    }else{
                        vm.bookingData.travel_pickup_point_addr1 = vm.pickupLocat[i].address1;
                  }
                  
                }
                if(vm.bookingData.travel_pickup_point_addr1 == '-'){
                  vm.bookingData.travel_pickup_point_addr1 = '';
                }
                vm.showPickupField = true;
              }
            }
          }
          else{
            vm.showPickupField = false;
          }
        }
        vm.populateOtherDropField = function(){
            if(loaddropofflag === false){
                //vm.bookingData.pickup_flight_details = "";
                vm.bookingData.dropoff_flight_details = "";
            }else{
                loaddropofflag = false;
            }
            
          if(vm.bookingData.drop_point_code){
            for(var i=0;i<vm.dropupLocat.length;i++){
              if(vm.dropupLocat[i].pickup_id == vm.bookingData.drop_point_code){
                if(vm.bookingData.drop_point_code.split('-')[0] == "OTHER"){
                  vm.bookingData.travel_drop_point_addr1 = vm.bookingData.travel_drop_point_addr1;
                }
                else{
                    if(vm.bookingData.travel_drop_point_addr1 != ""){
                        vm.bookingData.travel_drop_point_addr1 = vm.bookingData.travel_drop_point_addr1;
                    }else{
                        vm.bookingData.travel_drop_point_addr1 = vm.dropupLocat[i].address1;
                    }
                  
                }
                if(vm.bookingData.travel_drop_point_addr1 == '-'){
                  vm.bookingData.travel_drop_point_addr1 = '';
                }
                vm.showDropoffField = true;
              }
            }
          }
          else{
            vm.showDropoffField = false;
          }
        }

        vm.checkAirportPickup = function(){
          for(var i=0;i<vm.pickupLocat.length;i++){
            if(vm.pickupLocat[i].pickup_id == vm.bookingData.pickup_point_code){
              if(vm.pickupLocat[i].pickup_point_type == 'Airport'){
                vm.showPickupFlightDetails = true;
              }
              else{
                vm.showPickupFlightDetails = false;
              }
            }
            else{}
          }
          // if(vm.bookingData.pickup_point_code.indexOf("AIRPORT") != -1){
          //   vm.showPickupFlightDetails = true;
          // }
          // else{
          //   vm.showPickupFlightDetails = false;
          // }
        }
        vm.checkAirportDropoff = function(){
          for(var i=0;i<vm.pickupLocat.length;i++){
            if(vm.pickupLocat[i].pickup_id == vm.bookingData.drop_point_code){
              if(vm.pickupLocat[i].pickup_point_type == 'Airport'){
                vm.showDropoffFlightDetails = true;
              }
              else{
                vm.showDropoffFlightDetails = false;
              }
            }
            else{}
          }
          // if(vm.bookingData.drop_point_code.indexOf("AIRPORT") != -1){
          //   vm.showDropoffFlightDetails = true;
          // }
          // else{
          //   vm.showDropoffFlightDetails = false;
          // }
        }

    });