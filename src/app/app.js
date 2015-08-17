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
	'ishaApp.refreshToken'
	//'ishaApp.settings'
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

	$rootScope.baseURL = '';
	$rootScope.productsURL = '';
	$rootScope.credentials = {};
	//TODO: If present credentials are present in local storage, retrieve from it on startup
	$rootScope.credentials.token = '';
	$rootScope.credentials.tokenType = 'Bearer';
	$rootScope.credentials.tokenExpiresIn = '';
	$rootScope.credentials.tokenExpiresAt = '';
	$rootScope.credentials.refreshTokenURL = '';
	$rootScope.credentials.clientId = '';
	$rootScope.credentials.clientSecret = '';
	$rootScope.credentials.refreshToken = '';

	window.chrome.storage.onChanged.addListener(function(changes, namespace) {
		for (var key in changes) {
			var storageChange = changes[key];
			console.log('Storage key "%s" in namespace "%s" changed. ' +
					'Old value was "%s", new value is "%s".',
					key,
					namespace,
					storageChange.oldValue,
					storageChange.newValue);
		}
	});

}]);
