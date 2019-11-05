/*made by Miguel Rodrigues @ KBZ miguel.rodrigues@knowledgebiz.pt*/

'use strict';

var path = require('path');
module.exports.FRONTEND_PATH = path.normalize(__dirname + '/frontend');
module.exports.BACKEND_PATH = path.normalize(__dirname + '/frontend');

//testing paths
module.exports.ROUTES = {
	v0: {
		GET: {
			GETVAPPS 		    : "/api/vf-os-enabler/v0/getApps",
			GETRULES 		    : "/api/vf-os-enabler/v0/getRules",
			GETNOTIFICATIONS 	: "/api/vf-os-enabler/v0/getNotifications",
			GETSTATISTICS    	: "/api/vf-os-enabler/v0/getStatistics"
		},
		POST:{
			REGISTERVAPP	    : "/api/vf-os-enabler/v0/register",
			CREATERULES	        : "/api/vf-os-enabler/v0/notification/rules",
			CREATENOTIFICATIONS	: "/api/vf-os-enabler/v0/notifications"
		}
	}
}
