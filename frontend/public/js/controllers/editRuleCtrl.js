/*made by Miguel Rodrigues @ KBZ miguel.rodrigues@knowledgebiz.pt*/

console.log("Defining editRuleCtrl");

angular.module('mainApp')
.controller('editRuleCtrl', function($scope, $routeParams, $http, appService, $timeout) {
	$scope.show = false;
	$scope.showError = false;
	$scope.data = false;
	$scope.rulesid = $routeParams.rulesid;
	$scope.appID = $routeParams.appid;
	$scope.developerid = $routeParams.developerid;
	$scope.description = null;
	$scope.parameter = null;
	$scope.conditionValue = null;
	$scope.controlValue = null;
	$scope.threshold = null;
	$scope.notificationType = null;
	$scope.notifyType = null;
	$scope.hostname = null;
	$scope.port = null;
	$scope.path = null;
	$scope.method = null;
	$scope.emailsTo = null;
	$scope.rule = null;
	$scope.successDescription = 0;
	$scope.successParameter = 0;
	$scope.successControlValue = 0;
	$scope.successThreshold = 0;
	$scope.successHostname = 0;
	$scope.successPort = 0;
	$scope.successPath = 0;
	$scope.successEmails = 0;


	console.log("Running editRuleCtrl... ");
	appService.getAllRule($routeParams.rulesid).then(function(response){
		if(response.data.success){
			if(response.data.data.length > 0){
				console.log("getAllRule response: " + JSON.stringify(response.data));
				$scope.rule = response.data.data[0];
				$scope.description = response.data.data[0].description;
				$scope.parameter = response.data.data[0].parameter;
				$scope.conditionValue = response.data.data[0].conditionValue;
				$scope.controlValue = response.data.data[0].controlValue;
				$scope.threshold = response.data.data[0].threshold;
				$scope.notifyType = response.data.data[0].notifyType;
				$scope.notificationType = response.data.data[0].notificationType.toString();
				$scope.hostname = response.data.data[0].hostname;
				$scope.port = response.data.data[0].port;
				$scope.path = response.data.data[0].path;
				$scope.method = response.data.data[0].method;
				$scope.emailsTo = response.data.data[0].emailTo;
			}else{
				$scope.data = true;
				$scope.noData = "There is no recorded Data";
			}
		}
	},function(err){
		console.log("Resource doesn't exist");
		$scope.error = err.data.data;
	});
	
	$scope.postdata = function (description, parameter, conditionValue, controlValue, threshold, notifyType, notificationType, hostname, port, path, method, emailsTo) {
		if(description == null){
			$scope.successDescription = 2;
		}else if (parameter == null){
			$scope.successParameter = 2;
		}else if (isNaN(parseFloat(controlValue))){
			$scope.successControlValue = 2;
		}else if (isNaN(parseFloat(threshold))){
			$scope.successThreshold = 2;
		}else if (!isNaN(parseFloat(threshold))){
			if (notifyType == "HTTP Request"){
				emailsTo = null;
				notificationType = 0;
				if(hostname == null){
					$scope.successHostname = 2;
				}
				if(isNaN(parseInt(port))){
					$scope.successPort = 2;
				}
				if(path == null){
					$scope.successPath = 2;
				}else{
					editRule(description, parameter, conditionValue, controlValue, threshold, notifyType, notificationType, hostname, port, path, method, emailsTo);
				}
			}else{
				hostname = null;
				port = 0;
				path = null;
				method = null;
				if(emailsTo == null){
					$scope.successEmails = 2;
				}else{
					editRule(description, parameter, conditionValue, controlValue, threshold, notifyType, notificationType, hostname, port, path, method, emailsTo);
				}
			}
		}
	};

	function editRule(description, parameter, conditionValue, controlValue, threshold, notifyType, notificationType, hostname, port, path, method, emailsTo){
		switch(conditionValue){
			case ">":
			case ">=":
			if(threshold > 100){
				$scope.successThreshold = 3;
			}else{
				$scope.successDescription = 1;
				$scope.successParameter = 1;
				$scope.successControlValue = 1;
				$scope.successThreshold = 1;

				if (notifyType == "HTTP Request"){
					$scope.successHostname = 1;
					$scope.successPort = 1;
					$scope.successPath = 1;
				}
				else{
					$scope.successEmails = 1;
				}
				var data = {
					body:[{
						rulesid: $routeParams.rulesid,
						description: description,
						parameter: parameter,
						conditionValue: conditionValue,
						controlValue: controlValue,
						threshold: threshold,
						notifyType: notifyType,
						notificationType: notificationType,
						hostname: hostname,
						port: port,
						path: path,
						method: method,
						emailTo:[
						emailsTo
						]
					}]
				};
				appService.editRule(data).then(function(res) {
					if(res.data.success){
						console.log("Post Data Submitted Successfully!");
						$scope.show = true;
						$timeout(function() {
							$scope.show = false;
							window.location = '/notificationenabler/'+$routeParams.developerid+'/'+$routeParams.appid+'/listrules'
						}, 2000)
					}
				},function(err){
					$scope.showError = true;
					$timeout(function() {
						$scope.showError = false;
					}, 2000)
				});
			}
			break;
			case "<":
			case "<=":
			if(threshold < 100){
				$scope.successThreshold = 4;
			}else{
				$scope.successDescription = 1;
				$scope.successParameter = 1;
				$scope.successControlValue = 1;
				$scope.successThreshold = 1;

				if (notifyType == "HTTP Request"){
					$scope.successHostname = 1;
					$scope.successPort = 1;
					$scope.successPath = 1;
				}
				else{
					$scope.successEmails = 1;
				}
				var data = {
					body:[{
						rulesid: $routeParams.rulesid,
						description: description,
						parameter: parameter,
						conditionValue: conditionValue,
						controlValue: controlValue,
						threshold: threshold,
						notifyType: notifyType,
						notificationType: notificationType,
						hostname: hostname,
						port: port,
						path: path,
						method: method,
						emailTo:[
						emailsTo
						]
					}]
				};
				appService.editRule(data).then(function(res) {
					if(res.data.success){
						console.log("Post Data Submitted Successfully!");
						$scope.show = true;
						$timeout(function() {
							$scope.show = false;
							window.location = '/notificationenabler/'+$routeParams.developerid+'/'+$routeParams.appid+'/listrules'
						}, 2000)
					}
				},function(err){
					$scope.showError = true;
					$timeout(function() {
						$scope.showError = false;
					}, 2000)
				});
			}
			break;
			default:
		}
	}

	$scope.redirectAppManager = function () {
		window.location = '/notificationenabler/'+$routeParams.developerid        
	};

	$scope.redirectRuleManager = function () {
		window.location = '/notificationenabler/'+$routeParams.developerid+"/"+$routeParams.appid+"/listrules"        
	};
	console.log("Loading editRuleCtrl");
});