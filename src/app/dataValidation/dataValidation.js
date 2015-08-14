var dataValidation = angular.module( 'ngBoilerplate.dataValidation', [
				'ui.router',
        'ui.bootstrap',
        'ui.select',
        'ngSanitize',
				'ngBoilerplate.modals'
    ]);

dataValidation.config(['$stateProvider', function config( $stateProvider ) {
    $stateProvider.state( 'dataValidation', {
        url: '/data',
        views: {
            "main": {
                controller: 'DataValidationCtrl',
                templateUrl: 'dataValidation/dataValidation.tpl.html'
            }
        },
        data:{ pageTitle: 'Isha Product Details' }
    });
}]);

dataValidation.controller( 'DataValidationCtrl', [ '$rootScope', '$scope', '$http',
	function OffersController( $rootScope, $scope, $http) {
	$scope.productList = [];
	$scope.address = {};
	$scope.refreshAddresses = function(address) {
		var customParams = {address: address, components:'country:US'};
		return $http.get(
				'http://maps.googleapis.com/maps/api/geocode/json',
				{params: customParams}
		).then(function(response) {
					$scope.addresses = response.data.results;
				});
	};

	$scope.selectedEnvironment = {};
	$scope.environments = $rootScope.environments;

	// Pagination
	$scope.pagination = {};
	$scope.pagination.numPerPage = 10;
	$scope.pagination.maxPages = 10;
	$scope.pagination.currentPage = 1;

	$scope.pagination.updatePoisInView = function() {
		var begin = (($scope.pagination.currentPage - 1) * $scope.pagination.numPerPage);
		var end = begin + $scope.pagination.numPerPage;
		$scope.poisInView = (typeof($scope.productList.length) != 'undefined') ? $scope.productList.slice(begin, end) : [];
		//return (typeof($scope.offersList.length) != 'undefined') ? $scope.offerList.slice(begin, end) : [];
	};

	$scope.pagination.reset = function () {
		$scope.pagination.currentPage = 1;
		$scope.pagination.updatePoisInView();
	};

	$scope.pagination.reset();

	//$scope.$watch($scope.pagination.currentPage, function() {
	//	$scope.pagination.updateItemsInView($scope.offersList);
	//});

	//TODO: Clean up all these initializations
	// Hide/Show controls for UI elements
	$scope.showOffers = false;
	$scope.showPois = false;
	$scope.offerSearching = false;
	$scope.poiSearching = false;
	$scope.poiGetFail = false;
	$scope.offesGetFail = false;

	$scope.isha = {};
	$scope.isha.baseURL = '';
	$scope.isha.page = '';
	$scope.isha.pageSize = '';
	$scope.isha.token = '';
	$scope.isha.activeProducts = false;

	$scope.getProducts = function() {
		$('#search-for-offers-button').attr('disabled','disabled');
		$('#search-for-pois-button').attr('disabled','disabled');
		$scope.showOffers = false;
		$scope.showPois = false;
		$scope.poiSearching = true;
		$scope.poiGetFail = false;

		$http.get($scope.isha.baseURL + '?page_size='+ $scope.isha.pageSize  + '&page=' + $scope.isha.page + '&active=' + $scope.isha.activeProducts,
				{headers: {'Authorization': 'Bearer ' + $scope.isha.token}})
				.success(function(data) {
					$('#search-for-offers-button').removeAttr('disabled');
					$('#search-for-pois-button').removeAttr('disabled');
					$scope.poiSearching = false;
					$scope.showPois = true;
					$scope.productList = data.products;
					$scope.pagination.updatePoisInView();
				})
				.error(function(data, status, headers) {
					$('#search-for-offers-button').removeAttr('disabled');
					$('#search-for-pois-button').removeAttr('disabled');
					$scope.showPois = false;
					$scope.poiSearching = false;
					$scope.poiGetFail = true;
				});
	};

}]);