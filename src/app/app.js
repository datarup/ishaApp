/**
 * capture incoming JSONP and pass to angular.callbacks
 */
window.angularCallbacksProxy = function (data) {
  if(angular.callbacks.counter > 0) {
    var idx = (angular.callbacks.counter - 1).toString(36);
    angular.callbacks['_'+idx](data);
  }
};

var app = angular.module( 'ngBoilerplate', [
  'templates-app',
  'templates-common',
	'ngBoilerplate.dataValidation',
	'ui.router',
  'ui-rangeSlider',
	'ui.select2'
]);


app.config([ '$stateProvider', '$urlRouterProvider', function myAppConfig ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/data' );
}]);

app.run( function run () {
});

app.controller( 'AppCtrl',[ '$rootScope', '$scope', function AppCtrl ( $rootScope, $scope ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | Products' ;
    }
  });
}]);
