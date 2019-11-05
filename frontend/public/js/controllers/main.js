//http interceptor
function vfosInterceptor() {
    return {
        request: function (config) {
            if (config.url.includes("api")) {
                config.url = "/configurationenabler" + config.url;
                console.log("updating api http request to vfos platform...");
                console.log(config);
            }
            return config;
        },

        requestError: function (config) {
            return config;
        },

        response: function (res) {
            return res;
        },

        responseError: function (res) {
            return res;
        }
    }
}

/*made by Miguel Rodrigues @ KBZ miguel.rodrigues@knowledgebiz.pt*/

console.log("Defining mainApp");
angular.module('mainApp', ['ngRoute', 'ui.bootstrap', 'feRoutes'])
    .factory('vfosInterceptor', vfosInterceptor)
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('vfosInterceptor');
    })
