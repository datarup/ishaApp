var refreshToken = angular.module( 'ishaApp.refreshToken', [
				'ui.router',
        'ui.bootstrap',
        'ui.select',
        'ngSanitize',
				'ishaApp.modals'
    ]);

refreshToken.config(['$stateProvider', function config( $stateProvider ) {
    $stateProvider.state( 'refreshToken', {
        url: '/refreshToken',
        views: {
            "main": {
                controller: 'RefreshTokenCtrl',
                templateUrl: 'refreshToken/refreshToken.tpl.html'
            }
        },
        data:{ pageTitle: 'Isha Products | Refresh Token' }
    });
}]);

refreshToken.filter('secondsToDateTime', [function() {
	return function(seconds) {
		return new Date(1970, 0, 1).setSeconds(seconds);
	};
}]);

refreshToken.controller( 'RefreshTokenCtrl', [ '$rootScope', '$scope', '$http',
	function OffersController( $rootScope, $scope, $http) {

	$scope.selectedEnvironment = {};
	$scope.environments = $rootScope.environments;


	//TODO: Clean up all these initializations
	$scope.isha = {};
	$scope.isha.baseURL = '';
	$scope.isha.page = '';
	$scope.isha.pageSize = '';
	$scope.isha.token = '';
	$scope.isha.activeProducts = false;


	$scope.refreshTokenFail = false;
	$scope.refreshTokenError = '';


	var requestData = {'client_id': $scope.credentials.clientId, 'client_secret':$scope.credentials.clientSecret,
		'refresh_token': $scope.credentials.refreshToken, 'grant_type':'refresh_token'};

	var transform = function(data){
		return $.param(data);
	};

	$scope.getNewAccessToken = function() {
		$http.post('https://chromeapp.vendhq.com/api/1.0/token', requestData, {
			headers: {'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'},
			transformRequest: transform
			}).then(function(response) {
				$scope.refreshTokenFail = false;
				if(response.data){
					$rootScope.credentials.token = response.data.access_token;
					$rootScope.credentials.tokenType = response.data.token_type;
					$rootScope.credentials.tokenExpiresAt = new Date(response.data.expires*1000);
					$rootScope.credentials.tokenExpiresIn = response.data.expires_in;
				}
			}, function(data, status, headers) {
				$scope.refreshTokenFail = true;
				$scope.refreshTokenError = json.toString(data);
			}
		);
	};
}]);