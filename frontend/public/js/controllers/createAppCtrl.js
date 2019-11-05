/*made by Miguel Rodrigues @ KBZ miguel.rodrigues@knowledgebiz.pt*/

console.log("Defining createAppCtrl");
angular.module('mainApp')
.controller('createAppCtrl', function($scope, $routeParams, $http, appService, $timeout) {
	$scope.show = false;
	$scope.showError = false;
	$scope.appID = null;
	$scope.developerid = $routeParams.developerid;
	$scope.successappID = 0;

	console.log("Running createAppCtrl... ");
	$scope.postdata = function (appID) {
		$scope.successappID = 0;

		if(appID == null){
			$scope.successappID = 2;
		}else{
			$scope.successappID = 1;

			var data = {
				appID:[
				appID
				],
				developerID:[
				$routeParams.developerid
				]
			};
			appService.postApp(data).then(function(response) {
				if(response.data.success){
					console.log("Post Data Submitted Successfully!");
					$scope.notifytitle = "Success to create vApp";
					$scope.show = true;
					$timeout(function() {
						$scope.show = false;
						window.location = "/notificationenabler/"+$routeParams.developerid; 
					}, 2000)
				}
			},function(err){
				$scope.showError = true;
				$timeout(function() {
					$scope.showError = false;
				}, 2000)
			});
		}
	};

	$scope.redirectAppManager = function () {
		window.location = '/notificationenabler/'+$routeParams.developerid        
	};
	console.log("Loading createAppCtrl");
});