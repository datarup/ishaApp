var app = angular.module( 'vendClient', [
  'templates-app',
  'templates-common',
	'ui.router',
	'ui-rangeSlider',
	'ui.select2',
	'vendClient.dataValidation',
	'vendClient.refreshToken',
	'vendClient.settings'
]);


app.config([ '$stateProvider', '$urlRouterProvider', function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/data' );
}]);

app.run( function run () {
});

app.controller( 'AppCtrl',[ '$rootScope', '$scope', function AppCtrl ( $rootScope, $scope ) {
  $scope.$on('$stateChangeSuccess', function(event, toState){
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
			'vendClient_urls_productsURL', 'vendClient_urls_refreshTokenURL', 'vendClient_credentials_ClientId',
			'vendClient_credentials_ClientSecret', 'vendClient_credentials_refreshToken', 'vendClient_credentials_token', 'vendClient_credentials_tokenExpiresAt'
		], function (result) {
			$rootScope.urls.productsURL = result.vendClient_urls_productsURL;
			$rootScope.urls.refreshTokenURL = result.vendClient_urls_refreshTokenURL;
			$rootScope.credentials.clientId = result.vendClient_credentials_ClientId;
			$rootScope.credentials.clientSecret = result.vendClient_credentials_ClientSecret;
			$rootScope.credentials.refreshToken = result.vendClient_credentials_refreshToken;
			$rootScope.credentials.token = result.vendClient_credentials_token;
			$rootScope.credentials.tokenExpiresAt = result.vendClient_credentials_tokenExpiresAt;
			$rootScope.credentials.tokenExpiresAtFriendly = new Date($rootScope.credentials.tokenExpiresAt*1000);
		});
	};
	$scope.loadSettings();

}]);
