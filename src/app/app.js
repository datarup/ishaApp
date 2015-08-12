/**
 * capture incoming JSONP and pass to angular.callbacks
 */
window.angularCallbacksProxy = function (data) {
  if(angular.callbacks.counter > 0) {
    var idx = (angular.callbacks.counter - 1).toString(36);
    angular.callbacks['_'+idx](data);
  }
};

angular.module( 'ngBoilerplate', [
  'templates-app',
  'templates-common',
	'ngBoilerplate.dataValidation',
	'ui.router',
  'ui-rangeSlider',
	'ui.select2'
])


.config( function myAppConfig ( $stateProvider, $urlRouterProvider, $httpProvider ) {
  $urlRouterProvider.otherwise( '/data' );
})

.run( function run () {
})

.controller( 'AppCtrl', function AppCtrl ( $rootScope, $scope, $location, $http ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | Products' ;
    }
  });
});
