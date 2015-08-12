var dataValidation = angular.module( 'ngBoilerplate.dataValidation', [
				'ui.router',
        'ui.bootstrap',
        'ui.select',
        'ngSanitize',
				'ngBoilerplate.modals'
    ]);

dataValidation.config(function config( $stateProvider ) {
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
});

dataValidation.controller( 'DataValidationCtrl', [ '$rootScope', '$scope', '$http', '$location', 'modalService', '$timeout',
	function OffersController( $rootScope, $scope, $http, $location, modalService, $timeout) {

	$scope.poisList = [];
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
		$scope.poisInView = (typeof($scope.poisList.length) != 'undefined') ? $scope.poisList.slice(begin, end) : [];
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


	// Hide/Show controls for UI elements
	$scope.showOffers = false;
	$scope.showPois = false;
	$scope.offerSearching = false;
	$scope.poiSearching = false;
	$scope.poiGetFail = false;
	$scope.offesGetFail = false;

	//	// Create the XHR object.
	//$scope.createCORSRequest =	function (method, url) {
	//		var xhr = new XMLHttpRequest();
	//		if ("withCredentials" in xhr) {
	//			// XHR for Chrome/Firefox/Opera/Safari.
	//			xhr.open(method, url, true);
	//			xhr.setRequestHeader('Accept', 'application/json');
	//			xhr.withCredentials = true;
	//			xhr.setRequestHeader( 'Authorization', 'Bearer hcUVZv3eLrssVavyVSAV3b03LyDIj5CynatWuhh4' );
	//		} else if (typeof XDomainRequest != "undefined") {
	//			// XDomainRequest for IE.
	//			xhr = new XDomainRequest();
	//			xhr.open(method, url);
	//		} else {
	//			// CORS not supported.
	//			xhr = null;
	//		}
	//		return xhr;
	//};
	//// Make the actual CORS request.
	//$scope.makeCorsRequest = function () {
	//	// All HTML5 Rocks properties support CORS.
	//	//var url = 'http://updates.html5rocks.com';
	//	var url = 'https://ishashoppe.vendhq.com/api/products?page_size=2&page=1&active=true';
	//	var xhr = $scope.createCORSRequest('GET', url);
	//	if (!xhr) {
	//		alert('CORS not supported');
	//		return;
	//	}
	//	// Response handlers.
	//	xhr.onload = function() {
	//		var text = xhr.responseText;
	//		var title = $scope.getTitle(text);
	//		alert('Response from CORS request to ' + url + ': ' + title);
	//	};
	//
	//	xhr.onerror = function() {
	//		alert('Woops, there was an error making the request.');
	//	};
	//
	//	xhr.send();
	//};
	//
	//// Helper method to parse the title tag from the response.
	//$scope.getTitle =	function (text) {
	//	return text.match('<title>(.*)?</title>')[1];
	//};

		$scope.getProducts1 = function() {
			var xurl = 'https://chromeapp.vendhq.com/api/products?page_size=200&page=1&active=true';
			var xauth = 'iE1t3er7rbXAE6ZLtJJ8F8rDDf1KYBJajngl9cLE';
			var yurl = 'https://ishashoppe.vendhq.com/api/products?page_size=200&page=1&active=true';

			var xhr = new XMLHttpRequest();
			xhr.open('get', 'https://chromeapp.vendhq.com/api/products?page_size=2&page=1&active=true');
			xhr.setRequestHeader('Authorization',
					'Bearer iE1t3er7rbXAE6ZLtJJ8F8rDDf1KYBJajngl9cLE');

			xhr.onload = function () {
				if (this.status === 401) {
					// This status may indicate that the cached
					// access token was invalid. Retry once with
					// a fresh token.
					//retry = false;
					//chrome.identity.removeCachedAuthToken(
					//		{ 'token': access_token },
					//		getTokenAndXhr);
					console.log("401 error");
					return;
				} else {
					console.log("No Error");
				}

				//callback(null, this.status, this.responseText);
			};
			xhr.send();
		};

	$scope.isha = {};
	$scope.isha.baseURL = 'https://chromeapp.vendhq.com/api/products';
	$scope.isha.page = 1;
	$scope.isha.pageSize = 100;
	$scope.isha.token = 'iE1t3er7rbXAE6ZLtJJ8F8rDDf1KYBJajngl9cLE';
	$scope.isha.activeProducts = true;

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
					$scope.poisList = data.products;
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