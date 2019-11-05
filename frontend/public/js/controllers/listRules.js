/*made by Miguel Rodrigues @ KBZ miguel.rodrigues@knowledgebiz.pt*/

console.log("Defining listRules");
angular.module('mainApp')
.controller('listRules', function($scope, $routeParams, $http, appService, $timeout) {
	$scope.show = false;
	$scope.data = false;
	$scope.appId = $routeParams.appid;
	$scope.developerid = $routeParams.developerid;
	$scope.rule =[];

	console.log("Running listRules... ");
	appService.getAppRules($routeParams.appid).then(function(response){
		if(response.data.success){
			if(response.data.data.length > 0){
				console.log("getAppRules response: " + JSON.stringify(response.data));
				$scope.rule = response.data.data;
			}else{
				$scope.data = true;
				$scope.noData = "There is no recorded Data";
			}
		}
	},function(err){
		console.log("Resource doesn't exist");
		$scope.error = err.data.data;
	});

	$scope.deleterule = function (ruleID) {
		appService.deleteRule(ruleID).then(function(response){
			if(response.data.success){
				console.log("deleteRule response: " + JSON.stringify(response.data));
				//Delete ruleID from $scope
				angular.forEach($scope.rule, function(eachRule, index){
					console.log("DEBUG: " + JSON.stringify(eachRule) + JSON.stringify($scope.rule));
					if(eachRule.rulesID == ruleID){
						$scope.rule.splice(index,1);
						console.log("Deleted! index:"+index);
						$scope.show = true;
						$timeout(function() {
							$scope.show = false;
						}, 2000)
					}
				})		
			}
		})
	};

	$scope.redirectStatistics = function (rulesid) {
		window.location = '/notificationenabler/'+$routeParams.developerid+'/'+$routeParams.appid+'/'+rulesid+'/statistics'
	};

	$scope.redirectEditRules = function (rulesid) {
		window.location = '/notificationenabler/'+$routeParams.developerid+'/'+$routeParams.appid+'/'+rulesid+'/edit'
	};

	$scope.redirectNewRule = function () {
		window.location = '/notificationenabler/'+$routeParams.developerid+'/'+$routeParams.appid+'/create/rule'
	};

	$scope.redirectAppManager = function () {
		window.location = '/notificationenabler/'+$routeParams.developerid        
	};

	console.log("Loading listRules");
});
