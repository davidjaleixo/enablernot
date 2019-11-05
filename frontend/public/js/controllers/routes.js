/*made by Miguel Rodrigues @ KBZ miguel.rodrigues@knowledgebiz.pt*/

//FrontEnd Routes

console.log("Defining feRoutes");
angular.module('feRoutes', ['ngRoute'])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider
        // home page with the developerid as route parameter
        .when('/', {
            templateUrl: 'views/registerApp.html',
            controller: 'appCtrl'
        })
        .when('/:developerid', {
            templateUrl: 'views/appList.html',
            controller: 'listCtrl'
        })
        .when('/:developerid/:appid', {
            templateUrl: 'views/appView.html',
            controller: 'viewCtrl'
        })
        .when('/:developerid/:appid/listrules', {
            templateUrl: 'views/appListRules.html',
            controller: 'listRules'
        })
        .when('/:developerid/:appid/create/rule', {
            templateUrl: 'views/appRules.html',
            controller: 'rulesCtrl'
        })
        .when('/:developerid/:appid/:rulesid/statistics', {
            templateUrl: 'views/notificationStatistics.html',
            controller: 'statisticsCtrl'
        })
        .when('/create/new/app/:developerid', {
            templateUrl: 'views/createApp.html',
            controller: 'createAppCtrl'
        })
        .when('/:developerid/:appid/:rulesid/edit', {
            templateUrl: 'views/editRule.html',
            controller: 'editRuleCtrl'
        });
        $locationProvider.html5Mode(true);

    }])