/*made by Miguel Rodrigues @ KBZ miguel.rodrigues@knowledgebiz.pt*/

angular.module('mainApp')
.factory('appService', function($http){
	return {
		postApp: function(data){
			return $http.post('/api/vf-os-enabler/v0/register', JSON.stringify(data))
		},
		postAppRules: function(data){
			return $http.post('/api/vf-os-enabler/v0/notification/rules', JSON.stringify(data))
		},
		getAppNotifications: function(appid){
			return $http.get('/api/vf-os-enabler/v0/getNotifications/'+appid)
		},
		getAppRules: function(appid){
			return $http.get('/api/vf-os-enabler/v0/getRules/'+appid)
		},
		getRuleStatistics: function(rulesid){
			return $http.get('/api/vf-os-enabler/v0/getStatistics/'+rulesid)
		},
		getListByDevId: function(developerid){
			return $http.get('/api/vf-os-enabler/v0/getApps/'+developerid)
		},
		getAllRule: function(rulesid){
			return $http.get('/api/vf-os-enabler/v0/getAllRule/'+rulesid)
		},
		deleteApp: function(appid){
			return $http.delete('/api/vf-os-enabler/v0/app/'+appid)
		},
		deleteRule: function(rulesid){
			return $http.delete('/api/vf-os-enabler/v0/rule/'+rulesid)
		},
		editRule: function(data){
			return $http.put('/api/vf-os-enabler/v0/edit/', JSON.stringify(data))
		}
	}
})