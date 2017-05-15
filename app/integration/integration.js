//var PROD_URL = 'https://digital4ino.mckinsey.com/api/'; //MCK_PROD
// var PROD_URL = 'http://atkcabbooking-1777786101.us-east-1.elb.amazonaws.com/'; //XEBIA_PROD
var PROD_URL = 'http://VisualAid-1343078749.ap-northeast-2.elb.amazonaws.com/'; //XEBIA_QA
mdl_app = angular.module('integration', [])
    // .factory('verifyUserData',function($http, $localStorage, $cookies) {
    //     return function(requestObj, callBackFunc) {
    //       $.ajax({
    //         // url: 'https://digital4ino.mckinsey.com/OAuth2-SSO/oauth/token',//PROD_URL
    //         url: 'http://oauth-server-795787960.ap-northeast-2.elb.amazonaws.com/OAuth2-SSO/oauth/token',//QA
    //         type: 'POST',
    //         data: {username:requestObj.userid,password:requestObj.password,grant_type:'password'},
    //         beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Basic Z3Vlc3RfaG91c2VfcHdkOmdoX3NlY3JldA==')},
    //         contentType: 'application/x-www-form-urlencoded',
    //         success: function(response){
    //           $cookies.put('access_token', response.access_token,{path : '/'});
    //           var url = PROD_URL+'rest_mck/oauthlogin?';
    //     			$http.get(url+'access_token='+response.access_token)
    //           .success(function(data) {
    //     				callBackFunc(data);
    //           })
    //           .error(function() {
    //             console.log('error:verifyUserData');
    //           });
    //         },
    //         error: function(data) {
    //           return callback(data);
    //         }
    //       });
    //     }
    // })
    .factory('verifyUserData', ['$http', function($http, $localStorage) {
        return function(requestObj, callBackFunc) {
            var url = PROD_URL+'rest_mck/login/?';
            var transform = function(data){
                return $.param(data);
            }
            $http.post(url,{userid : requestObj.userid,password:requestObj.password},{
              headers:{
                'Content-Type':'application/x-www-form-urlencoded'
              },
              transformRequest: transform
            })
            // $http.get(url + "userid=" + requestObj.userid + "&password=" + requestObj.password)
                .success(function(data) {
                    callBackFunc(data);
                })
                .error(function(error,status) {
                    console.log('error:verifyUserData');
                    if(error === undefined && status === undefined){
                      alert('Server Error ! Please try again');
                    }
                });
        }
    }])

.factory('getBookingDetails', ['$http', function($http, $localStorage,$state) {
        return function(requestObj, callBackFunc) {
            var url = PROD_URL+'rest_mck/Travel_List_Request/?';
            $http.get(url + 'employee_id=' + requestObj.userid)
                .success(function(data) {
                    callBackFunc(data);
                })
                .error(function(error,status) {
                    console.log('error:getBookingDetails');
                    if(error === undefined && status === undefined){
                      alert('Server Error ! Please try again');
                    }
                });
        }
    }])
    .factory('getCities', ['$http', function($http) { //new function for bug1
        return function(requestObj, callBackFunc) {
            //var url = '../style/assets/json/getCities.json';
            
            var url = PROD_URL+'rest_mck/get_master/?empl_cd='+ requestObj;
            $http.get(url)
                .success(function(data) {
                    callBackFunc(data);
                })
                .error(function(error,status) {
                    console.log('error:getCities');
                    if(error === undefined && status === undefined){
                      alert('Server Error ! Please try again');
                    }
                });

        }
    }])

.factory('getEmployeeDetail', ['$http', function($http) {
    return function(requestObj, callBackFunc) {
        //var url = '../style/assets/json/getCities.json';
        var url = PROD_URL+'rest_mck/employee/';
        $http.get(url)
            .success(function(data) {
                callBackFunc(data);
            })
            .error(function(error) {
                console.log('error:getEmployeeDetail');
                if(error === undefined && status === undefined){
                  alert('Server Error ! Please try again');
                }
            });

    }
}])

.factory('viewIndBooking', ['$http', function($http) {
    return function(requestObj, callBackFunc) {
        // var url = '../style/assets/json/login-success.json';
        // $http.get(url)
        var url = PROD_URL+'rest_mck/Travel_View_Request/?';
        $http.get(url + 'id=' + requestObj)
            .success(function(data) {
                console.log(data);
                callBackFunc(data);
            })
            .error(function() {
                location.hash = '#booking-view';
            });

    }
}])

.factory('changePasswordDetail', ['$http', function($http) {
        return function(requestObj, callBackFunc) {
            //var url = '../style/assets/json/getCities.json';
            var url = PROD_URL+'rest_mck/change_passwd/?';
            $http.get(url + 'userid=' + requestObj.userId + '&oldpassword=' + requestObj.oldPassword + '&password=' + requestObj.newPassword)
                .success(function(data) {
                    callBackFunc(data);
                })
                .error(function() {
                    console.log('error:getCities');
                });

        }
    }])
    .factory('saveBooking', ['$http', function($http, $localStorage) {
        return function(requestObj, callBackFunc) {
            var url = PROD_URL+'rest_mck/Travel_Post_Request?';
            $http.get(url + "id=" + "0" + "&request_raised_by=" + requestObj.userid + "&request_raised_for=" + requestObj.request_raised_for.empl_cd + "&travel_from_date=" + requestObj.travel_from_date + "&travel_to_date=" + requestObj.travel_to_date + "&pickup_location=" + requestObj.pickup_location + "&pickup_point_code=" + requestObj.pickup_point_code + "&drop_location=" + requestObj.pickup_location + "&drop_point_code=" + requestObj.drop_point_code + "&charge_type=" + encodeURIComponent(requestObj.cCode) + "&travel_pickup_time=" + requestObj.travel_pickup_time + "&travel_package=" + requestObj.travel_package + "&car_class_rmk=" + requestObj.car_class_rmk + "&travel_guests1_mobile_no="+encodeURIComponent(requestObj.mobile_no) + "&travel_pickup_point_addr1="+requestObj.travel_pickup_point_addr1+"&travel_drop_point_addr1="+requestObj.travel_drop_point_addr1+"&pickup_flight_details="+requestObj.pickup_flight_details+"&dropoff_flight_details="+requestObj.dropoff_flight_details).success(function(data) {
                    callBackFunc(data);
                })
                .error(function() {
                    console.log('error:saveBooking');
                })
        }
    }])

.factory('updateBookingDetail', ['$http', function($http, $localStorage) {
    return function(requestObj, callBackFunc) {
        var url = PROD_URL+'rest_mck/Travel_Post_Request?';
        $http.get(url + "id=" + requestObj.id + "&request_raised_by=" + requestObj.userid + "&request_raised_for=" + requestObj.request_raisedfor + "&travel_from_date=" + requestObj.travelfrom_date + "&travel_to_date=" + requestObj.travelto_date + "&pickup_location=" + requestObj.pickup_location + "&pickup_point_code=" + requestObj.pickup_point_code + "&drop_location=" + requestObj.pickup_location + "&drop_point_code=" + requestObj.drop_point_code + "&charge_type=" + encodeURIComponent(requestObj.charge_type) + "&travel_pickup_time=" + requestObj.pickupTime + "&travel_package=" + requestObj.travel_package + "&car_class_rmk=" + requestObj.car_class_rmk + "&travel_guests1_mobile_no="+encodeURIComponent(requestObj.travel_guests1_mobile_no) + "&travel_pickup_point_addr1="+requestObj.travel_pickup_point_addr1+"&travel_drop_point_addr1="+requestObj.travel_drop_point_addr1+"&pickup_flight_details="+requestObj.pickup_flight_details+"&dropoff_flight_details="+requestObj.dropoff_flight_details).success(function(data) {
                callBackFunc(data);
            })
            .error(function() {
                console.log('error:saveBooking');
            })
    }
}])

.factory('cancelBooking', ['$http', function($http, $localStorage) {
    return function(requestObj, callBackFunc) {
        var url = PROD_URL+'rest_mck/Travel_Cancel_Request?';
        $http.get(url + "id=" + requestObj.id).success(function(data) {
                callBackFunc(data);
            })
            .error(function() {
                console.log('error:saveBooking');
            })
    }
}])

.factory('generatePassword', ['$http', function($http, $localStorage) {
        return function(requestObj, callBackFunc) {
            var url = PROD_URL+'rest_mck/forget_passwd?';
            $http.get(url + "userid=" + requestObj).success(function(data) {
                    callBackFunc(data);
                })
                .error(function() {
                    console.log('error:saveBooking');
                })
        }
    }])
    .factory('resetSession', ['$http', function($http, $localStorage) {
        return function(requestObj, callBackFunc) {
            var url = PROD_URL+'rest_mck/signout';
            $http.get(url).success(function(data) {
                    callBackFunc(data);
                })
                .error(function() {
                    console.log('error:saveBooking');
                })
        }
    }])
