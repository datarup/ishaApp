/**
 * capture incoming JSONP and pass to angular.callbacks
 */
window.angularCallbacksProxy = function (data) {
  if(angular.callbacks.counter > 0) {
    var idx = (angular.callbacks.counter - 1).toString(36);
    angular.callbacks['_'+idx](data);
  }
};

var app = angular.module( 'ishaApp', [
  'templates-app',
  'templates-common',
	'ui.router',
	'ui-rangeSlider',
	'ui.select2',
	'ishaApp.dataValidation',
	'ishaApp.refreshToken',
	'ishaApp.settings'
]);


app.config([ '$stateProvider', '$urlRouterProvider', function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/data' );
}]);

app.run( function run () {
});

app.controller( 'AppCtrl',[ '$rootScope', '$scope', function AppCtrl ( $rootScope, $scope ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle ;
    }
  });

	$rootScope.urls = {};
	$rootScope.urls.productsURL = '';
	$rootScope.urls.refreshTokenURL = '';

	$rootScope.credentials = {};
	$rootScope.credentials.token = '';
	$rootScope.credentials.tokenType = 'Bearer';
	$rootScope.credentials.tokenExpiresIn = '';
	$rootScope.credentials.tokenExpiresAt = '';
	$rootScope.credentials.tokenExpiresAtFriendly = '';
	$rootScope.credentials.refreshTokenURL = '';
	$rootScope.credentials.clientId = '';
	$rootScope.credentials.clientSecret = '';
	$rootScope.credentials.refreshToken = '';

	//Load changes from chrome storage on startup
	$scope.loadSettings = function() {
		window.chrome.storage.sync.get([
			'ishaApp_urls_productsURL', 'ishaApp_urls_refreshTokenURL', 'ishaApp_credentials_ClientId',
			'ishaApp_credentials_ClientSecret', 'ishaApp_credentials_refreshToken', 'ishaApp_credentials_token', 'ishaApp_credentials_tokenExpiresAt'
		], function (result) {
			$rootScope.urls.productsURL = result.ishaApp_urls_productsURL;
			$rootScope.urls.refreshTokenURL = result.ishaApp_urls_refreshTokenURL;
			$rootScope.credentials.clientId = result.ishaApp_credentials_ClientId;
			$rootScope.credentials.clientSecret = result.ishaApp_credentials_ClientSecret;
			$rootScope.credentials.refreshToken = result.ishaApp_credentials_refreshToken;
			$rootScope.credentials.token = result.ishaApp_credentials_token;
			$rootScope.credentials.tokenExpiresAt = result.ishaApp_credentials_tokenExpiresAt;
			$rootScope.credentials.tokenExpiresAtFriendly = new Date($rootScope.credentials.tokenExpiresAt*1000);
		});
	};
	$scope.loadSettings();

}]);
