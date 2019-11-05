/*made by Miguel Rodrigues @ KBZ miguel.rodrigues@knowledgebiz.pt*/

console.log("Defining viewCtrl");
angular.module('mainApp')
.controller('viewCtrl', function($scope, $routeParams, $http, appService) {
	$scope.appId = $routeParams.appid;
	$scope.developerid = $routeParams.developerid;
	$scope.data = false;

	console.log("Running viewCtrl... ");
	appService.getAppNotifications($routeParams.appid).then(function(response){
		if(response.data.success){
			if(response.data.data.length > 0){
				console.log("getAppNotifications response: " + JSON.stringify(response.data));
				$scope.notifications = response.data.data;
			}else{
				$scope.data = true;
				$scope.noData = "There is no recorded Data";
			}
		}	
	},function(err){
		console.log("Resource doesn't exist");
		$scope.error = err.data.data;
	});

	$scope.redirectAppManager = function () {
		window.location = '/notificationenabler/'+$routeParams.developerid        
	};
	console.log("Loading viewCtrl");
});