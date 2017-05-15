'use strict';

angular.module('mdl-Cab').controller('NewBookingController', function(getCities, $localStorage, $scope, saveBooking, getEmployeeDetail, $state, $rootScope) {
  $(document).ready(function(){
    $('#pickupTime').pickatime({
      twelvehour: false
    });
    $('.datepicker').pickadate({
     selectMonths: true, // Creates a dropdown to control month
     selectYears: 15, // Creates a dropdown of 15 years to control year
     format: 'yyyy-mm-dd'
    });
    document.getElementById("pickupTime").type="time";
    if(navigator.userAgent.indexOf("Firefox") != -1 ){
      document.getElementById("pickupTime").value = document.getElementById("pickupTime").value.slice(0,5);
    }
  });
  $scope.select2Options = {
        allowClear:true
    };
  $rootScope.bodyClass = 'bodyBackground';
  var vm = this;
  vm.cCode = null;
  vm.pickupCity = {};
  vm.pickCity = "select";
  vm.pickupType = [
    {
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
    }
  ];

  $scope.headerTitle = "Cab Booking";
  $scope.hideMenu = true;
  vm.storage = $localStorage.userDetail;

  vm.bookingDetail = {};
  vm.bookingDetail.travel_pickup_point_addr1 = '';
  vm.bookingDetail.travel_drop_point_addr1 = '';
  vm.showPickupField = false;
  vm.showDropoffField = false;
  vm.showPickupFlightDetails = false;
  vm.showDropoffFlightDetails = false;
  vm.forDate = {
    value: new Date(2015, 3, 22),
    currentDate: new Date()
  };
console.log(vm.pickupCity);
  // constant for number of minutes from current time, that the pick up time should defult to
  // in case of new bookings
  var TIME_DIFF = 60;
  
  var reqObj = {};
  
  //FOR TESTING PURPOSE
  //reqObj.userid = 85460;

  if (vm.storage) {
      reqObj.userid = vm.storage.userid;
  }

  getCities(reqObj.d, function(response) {

    vm.pickupCity = response.city;
    //vm.pickupType = response.data.TYPE_TRAVEL;
  });
  getEmployeeDetail({}, function(response) {
    vm.requester = response;
    vm.bookingDetail.request_raised_for = vm.requester.filter(selectMe(vm.storage))[0];
    if (vm.bookingDetail.request_raised_for) {
      $('.select2-chosen').html(vm.bookingDetail.request_raised_for.name);
      vm.bookingDetail.contact = vm.bookingDetail.request_raised_for.mobile_no;
    }
    else{

    }
  });
  vm.populateOtherPickupField = function(){

    vm.bookingDetail.pickup_flight_details = "";
    if(vm.bookingDetail.pickup_point_code){
      for(var i=0;i<vm.pickupLocat.length;i++){
        if(vm.pickupLocat[i].pickup_id == vm.bookingDetail.pickup_point_code){
		
          vm.bookingDetail.travel_pickup_point_addr1 = vm.pickupLocat[i].address1;
          if(vm.bookingDetail.travel_pickup_point_addr1 == '-'){
            vm.bookingDetail.travel_pickup_point_addr1 = '';
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
    //vm.bookingDetail.pickup_flight_details = "";
    vm.bookingDetail.dropoff_flight_details = "";

    if(vm.bookingDetail.drop_point_code){
      for(var i=0;i<vm.dropupLocat.length;i++){
        if(vm.dropupLocat[i].pickup_id == vm.bookingDetail.drop_point_code){
          vm.bookingDetail.travel_drop_point_addr1 = vm.dropupLocat[i].address1;
          if(vm.bookingDetail.travel_drop_point_addr1 == '-'){
            vm.bookingDetail.travel_drop_point_addr1 = '';
          }
          
          vm.showDropoffField = true;
        }
      }
    }
    else{
      vm.showDropoffField = false;
    }
  }
  vm.selectPickupLocation = function(cityName) {
    
    vm.bookingDetail.pickup_flight_details = "";
    vm.showPickupFlightDetails = false;
    vm.bookingDetail.dropoff_flight_details = "";
    vm.showDropoffFlightDetails = false;


    vm.showPickupFlightDetails = false;
    angular.forEach(vm.pickupCity, function(val, key) {
      if (vm.pickupCity[key].code == cityName) {
        vm.pickupLocat = vm.pickupCity[key].pickup_code;
        vm.dropupLocat = vm.pickupCity[key].pickup_code;
      }
    })
  }

  vm.pType = null;
  // vm.bookingFor = null;
  // vm.bookingTo = null;
  vm.storage = $localStorage.userDetail;

  // vm.autocomplete = new google.maps.places.Autocomplete(document.getElementById('adr'));
  // vm.autocompleteDrop = new google.maps.places.Autocomplete(document.getElementById('adrDrop'));
  vm.postSingleCabRequest = function() {
    vm.bookingDetail.travel_pickup_time = new Date(vm.bookingDetail.pickupTime).getFormattedTime();
    // vm.bookingDetail.travel_from_date = new Date(vm.bookingDetail.travelfrom_date).format(vm.bookingDetail.travelfrom_date);
    vm.bookingDetail.travel_from_date = new Date().format(vm.bookingDetail.travelfrom_date);
    // vm.bookingDetail.pickup_point_code = vm.bookingDetail.pickup_point_code == 'Other'? document.getElementById('adr').value
    //   : vm.bookingDetail.pickup_point_code;
    vm.bookingDetail.pickup_point_code = vm.bookingDetail.pickup_point_code;
    // vm.bookingDetail.drop_point_code = vm.bookingDetail.drop_point_code == 'Other'? document.getElementById('adrDrop').value
    //   : vm.bookingDetail.drop_point_code;
    vm.bookingDetail.drop_point_code = vm.bookingDetail.drop_point_code;
    // vm.bookingDetail.travel_to_date = new Date(vm.bookingDetail.travelto_date).format(vm.bookingDetail.travelto_date);
    vm.bookingDetail.travel_to_date = new Date().format(vm.bookingDetail.travelto_date);
    vm.bookingDetail.userid = vm.storage.userid;
    vm.bookingDetail.mobile_no = vm.bookingDetail.contact;

    vm.bookingDetail.car_class_rmk = (vm.bookingDetail.car_class_rmk===undefined)?'':vm.bookingDetail.car_class_rmk;

    vm.bookingDetail.travel_pickup_point_addr1 = (vm.bookingDetail.travel_pickup_point_addr1===undefined)?'':vm.bookingDetail.travel_pickup_point_addr1;

    vm.bookingDetail.travel_drop_point_addr1 = (vm.bookingDetail.travel_drop_point_addr1===undefined)?'':vm.bookingDetail.travel_drop_point_addr1;

    vm.bookingDetail.pickup_flight_details = (vm.bookingDetail.pickup_flight_details===undefined)?'':vm.bookingDetail.pickup_flight_details;

    vm.bookingDetail.dropoff_flight_details = (vm.bookingDetail.dropoff_flight_details===undefined)?'':vm.bookingDetail.dropoff_flight_details;

    saveBooking(vm.bookingDetail, function(response) {
      if (response.status == '001') {
        Materialize.toast('Request successfully added!', 1400);
        vm.bookingDetail = {};
        $state.go('booking-view');
      } else {
        Materialize.toast(response.status_description, 2000);
      }
    })

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
  Date.prototype.getFormattedTime = function() {
    return ((this.getHours() < 10? '0'
      : '') + this.getHours()) + ':' + ((this.getMinutes() < 10? '0'
      : '') + this.getMinutes());
  }
  Date.prototype.getDuration = function() {
    return ((this.getHours() < 10? '0'
      : '') + this.getHours()) + '.' + ((this.getMinutes() < 10? '0'
      : '') + this.getMinutes());
  }
  Date.prototype.zeroSeconds = function() {
    this.setSeconds(0);
    this.setMilliseconds(0);
  };
  Date.prototype.thresholdMinutes = function() {
    this.setMinutes(this.getMinutes() + TIME_DIFF);
  };
  vm.DateEnable = true;
  var currDate = new Date();

  vm.validateTime = function() {
    currDate = new Date();
    currDate.zeroSeconds();

    if (vm.bookingDetail.travelfrom_date !== 'undefined') {
      var selectedPickupDate = new Date(vm.bookingDetail.travelfrom_date);
      var selectedStartTime = new Date(vm.bookingDetail.pickupTime);
      var pickupAt = getPickupAt(selectedPickupDate, selectedStartTime);

      if (pickupAt >= currDate) {
        return vm.DateEnable;
      } else {
        vm.bookingDetail.pickupTime = currDate;
        vm.DateEnable = false;
        Materialize.toast('Bookings cannot be created for already passed start time', 2000);
        return vm.DateEnable;
      }
    }
  }

  vm.validateToDate = function validateToDate() {
    if (vm.bookingDetail.travelto_date !== 'undefined') {
      if (vm.bookingDetail.travelfrom_date > vm.bookingDetail.travelto_date) {
        vm.bookingDetail.travelto_date = vm.bookingDetail.travelfrom_date;
        Materialize.toast('To date cannot be less than from date', 2000);
      }
    } else {
      vm.bookingDetail.travelto_date = vm.bookingDetail.travelfrom_date;
    }
  }

  function getPickupAt(pickupDate, pickupTime) {
    var date = pickupDate.getDate();
    var month = pickupDate.getMonth();
    var year = pickupDate.getFullYear();

    var hour = pickupTime.getHours();
    var min = pickupTime.getMinutes();

    var pickup = new Date(year, month, date, hour, min);

    return pickup;
  }

  function setDefaultPickupAt() {
    vm.bookingDetail.pickupTime = new Date();
    vm.bookingDetail.pickupTime.setMinutes(vm.bookingDetail.pickupTime.getMinutes() + TIME_DIFF);
    vm.bookingDetail.pickupTime.zeroSeconds();

    // setting from and to dates to pickup time will take care of boundary times
    // when user can book for next day
    // say at 11:40 PM, in which case he can only book for next date 12:10 AM
    vm.bookingDetail.travelfrom_date = vm.bookingDetail.pickupTime;
    vm.bookingDetail.travelto_date = vm.bookingDetail.pickupTime;
  }

  vm.changedBookingFor = function() {
    vm.bookingDetail.contact = vm.bookingDetail.request_raised_for.mobile_no;
    
    vm.pickupCity = "";
    vm.pickup_point_code = "";
    vm.showPickupField = false;
    vm.pickupLocat = "";
    vm.dropupLocat = "";
    vm.bookingDetail.pickup_flight_details = "";
    vm.showPickupFlightDetails = false;
    vm.bookingDetail.dropoff_flight_details = "";
    vm.showDropoffFlightDetails = false;


    getCities(vm.bookingDetail.request_raised_for.empl_cd, function(response) {
      vm.pickupCity = response.city;

      //vm.pickupType = response.data.TYPE_TRAVEL;
    });

   

  };

  function initNewBooking() {
    // var user = angular.fromJson(vm.storage.userid);
    setDefaultPickupAt();
    vm.bookingDetail.travel_package = vm.pickupType[0].pType;
  }

  function selectMe(user) {
    return function(element) {
      return element.empl_cd === user.userid;
    };
  }
  vm.resetRiderDetail = function(){
    vm.bookingDetail.request_raised_for = null;
    $('.select2-chosen').html('');
  }
  vm.checkAirportPickup = function(){
    for(var i=0;i<vm.pickupLocat.length;i++){
      if(vm.pickupLocat[i].pickup_id == vm.bookingDetail.pickup_point_code){
        if(vm.pickupLocat[i].pickup_point_type == 'Airport'){
          vm.showPickupFlightDetails = true;
        }
        else{
          vm.showPickupFlightDetails = false;
        }
      }
      else{}
    }
    // if(vm.bookingDetail.pickup_point_code.indexOf("AIRPORT") != -1){
    //   vm.showPickupFlightDetails = true;
    // }
    // else{
    //   vm.showPickupFlightDetails = false;
    // }
  }
  vm.checkAirportDropoff = function(){
    for(var i=0;i<vm.pickupLocat.length;i++){
      if(vm.pickupLocat[i].pickup_id == vm.bookingDetail.drop_point_code){
        if(vm.pickupLocat[i].pickup_point_type == 'Airport'){
          vm.showDropoffFlightDetails = true;
        }
        else{
          vm.showDropoffFlightDetails = false;
        }
      }
      else{}
    }
    // if(vm.bookingDetail.drop_point_code.indexOf("AIRPORT") != -1){
    //   vm.showDropoffFlightDetails = true;
    // }
    // else{
    //   vm.showDropoffFlightDetails = false;
    // }
  }
  initNewBooking();
})
