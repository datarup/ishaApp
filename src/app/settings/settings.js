var settings = angular.module( 'ishaApp.settings', [
				'ui.router',
        'ui.bootstrap',
        'ui.select',
        'ngSanitize',
				'ishaApp.modals'
    ]);

settings.config(['$stateProvider', function config( $stateProvider ) {
    $stateProvider.state( 'settings', {
        url: '/settings',
        views: {
            "main": {
                controller: 'SettingsCtrl',
                templateUrl: 'settings/settings.tpl.html'
            }
        },
        data:{ pageTitle: 'Isha Products | Settings' }
    });
}]);

settings.controller( 'SettingsCtrl', [ '$rootScope', '$scope', '$http',
	function OffersController( $rootScope, $scope, $http) {

	$scope.settingsFail = false;
	$scope.settingsError = '';

	$scope.saveChanges = function() {
		window.chrome.storage.sync.set({
			'ishaApp_urls_productsURL': $rootScope.urls.productsURL,
			'ishaApp_urls_refreshTokenURL' : $rootScope.urls.refreshTokenURL,
			'ishaApp_credentials_ClientId' : $rootScope.credentials.clientId,
			'ishaApp_credentials_ClientSecret' : $rootScope.credentials.clientSecret,
			'ishaApp_credentials_refreshToken' : $rootScope.credentials.refreshToken,
			'ishaApp_credentials_token' : $rootScope.credentials.token
		}, function() {
			// Notify that we saved.
			//message('Settings saved');
		});
	};

	$scope.getSettings = function() {
		window.chrome.storage.sync.get('urls_productsURL', function (result) {
			alert(result.urls.productsURL);
		});
	};

}]);