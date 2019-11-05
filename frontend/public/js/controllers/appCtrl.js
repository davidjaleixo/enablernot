/*made by Miguel Rodrigues @ KBZ miguel.rodrigues@knowledgebiz.pt*/

console.log("Defining appCtrl");
angular.module('mainApp')
.controller('appCtrl', function($scope, $http, appService, $timeout) {
	$scope.show = false;
	$scope.showError = false;
	$scope.appID = null;
	$scope.developerID = null;
	$scope.successappID = 0;
	$scope.successDeveloperID = 0;

	console.log("Running appCtrl... ");
	$scope.postdata = function (appID, developerID) {
		$scope.successappID = 0;
		$scope.successDeveloperID = 0;

		if(appID == null){
			$scope.successappID = 2;
		}else if (developerID == null){
			$scope.successDeveloperID = 2;
		}else{
			$scope.successappID = 1;
			$scope.successDeveloperID = 1;
			
			var data = {
				appID:[
				appID
				],
				developerID:[
				developerID
				]
			};
			appService.postApp(data).then(function(response) {
				if(response.data.success){
					console.log("Post Data Submitted Successfully!");
					$scope.show = true;
					$timeout(function() {
						$scope.show = false;
						window.location = "/notificationenabler/"+developerID
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
	console.log("Loading appCtrl");
});