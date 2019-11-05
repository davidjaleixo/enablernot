/*made by Miguel Rodrigues @ KBZ miguel.rodrigues@knowledgebiz.pt*/

console.log("Defining statisticsCtrl");
angular.module('mainApp')
.controller('statisticsCtrl', function($scope, $routeParams, $http, appService) {
	$scope.appID = $routeParams.appid;
	$scope.developerid = $routeParams.developerid;
	$scope.data = false;

	console.log("Running statisticsCtrl for developerid (" + $routeParams.developerid + ") for vApp (" + $routeParams.appid + ")... ");
	appService.getRuleStatistics($routeParams.rulesid).then(function(response){
		if(response.data.success){
			if(response.data.data.length > 0){
				console.log("getRuleStatistics response: " + JSON.stringify(response.data));
				$scope.statistics = response.data.data;
				$scope.totalNotifications = response.data.total.totalNotifications;
				$scope.totalNotificationsApplyByRules = response.data.total.totalNotificationsApplyByRules;
				$scope.averageValue = response.data.total.averageValue;
				$scope.percentage = response.data.total.percentage;
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
	$scope.redirectRuleManager = function () {
		window.location = '/notificationenabler/'+$routeParams.developerid+"/"+$routeParams.appid+"/listrules"        
	};
	console.log("Loading statisticsCtrl");
});

