/*made by Miguel Rodrigues @ KBZ miguel.rodrigues@knowledgebiz.pt*/

console.log("Defining listCtrl");
angular.module('mainApp')
.controller('listCtrl', function($scope, $routeParams, $http, appService, $timeout) {
	$scope.show = false;
	$scope.developerid = $routeParams.developerid;
	$scope.apps =[];

	console.log("Running listCtrl for developerid (" + $routeParams.developerid + ")... ");
	appService.getListByDevId($routeParams.developerid).then(function(response){
		if(response.status == 200){
			console.log("getListByDevId response: " + JSON.stringify(response.data));
			$scope.apps = response.data.data;
			//get notifications already stored for each app
			angular.forEach($scope.apps,function(eachApp){
				appService.getAppNotifications(eachApp.appID).then(function(res){
					if(res.data.success){
						eachApp.notifications = res.data.data.length;
					}
				})
			})
			//get number of rules for each app
			angular.forEach($scope.apps, function(eachApp){
				appService.getAppRules(eachApp.appID).then(function(res){
					if(res.data.success){
						eachApp.rules = res.data.data.length;
					}
				})
			})
		}
	},function(err){
		console.log("Resource doesn't exist");
		$scope.error = err.data.data;
	});

	$scope.redirect = function (appID, type) {
		if(type == 1){
			window.location = '/notificationenabler/'+$routeParams.developerid+'/'+appID
		}else{
			window.location = '/notificationenabler/'+$routeParams.developerid+'/'+appID+'/listrules'
		}      
	};

	$scope.delete = function (appID) {
		appService.deleteApp(appID).then(function(response){
			if(response.data.success){
				console.log("deleteApp response: " + JSON.stringify(response.data));
				//Delete appID from $scope
				angular.forEach($scope.apps, function(app, index){
					if(app.appID == appID){
						$scope.apps.splice(index,1);
						$scope.show = true;
						$timeout(function() {
							$scope.show = false;
						}, 2000)
					}
				})		
			}
		})
	};

	$scope.redirectCreateApp = function () {
		window.location = '/notificationenabler/create/new/app/'+$routeParams.developerid        
	};

	$scope.redirectAppManager = function () {
		window.location = '/notificationenabler/'+$routeParams.developerid        
	};
	console.log("Loading listCtrl");
});

