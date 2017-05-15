'use strict';

angular.module('appHandler', [])
    .factory('httpPreConfig', ['$http', '$rootScope', '$timeout', function($http, $rootScope, $localStorage) {
        var customData = {};

        $http.defaults.transformRequest.push(function (data) {
          $rootScope.$broadcast('HTTP_CALL_STARTED'); //For showing progress bar when the server call begins.
            if(data !== undefined) {	// if data is present then adding the object custom data.
            data			= JSON.parse(data);
            // data.customData = customData;
            data			= JSON.stringify(data);
          }
              return data;
          });

          $http.defaults.transformResponse.push(function(data){
          	$rootScope.$broadcast('HTTP_CALL_STOPPED');	// For hiding progress bar when the server call ends.
      			$rootScope.data = data;
      			if(data.customData !== undefined) {	// if customdata is available then storing in customData object
              	customData = data.customData;
              }
      				if(data.error == 'invalid_token'){	// if info is available in response then handling it for session timeout and error.
      	    		$localStorage.$reset();
      	    		//window.location.href = location.origin+'/cab';
      	    		window.location.href = location.origin;
      	    	}
              return data;
          })
        return $http;
    }]);
