/*made by Miguel Rodrigues @ KBZ miguel.rodrigues@knowledgebiz.pt*/

//controllerV0 - First Version

var database               = require('./mysql');
var logger                 = require('../config/logger.js');
var controllerNotification = require('../backend/notificationManager');
var smartSystem            = require('../backend/smartRuleSystem');

/*
Description: Module for vApp Register
Input:
	req: JSON Body
Output: true(200)/false(500)
*/
module.exports.registerVapp= function (req, res) {
	logger.info("Request type: ",req.method, "Request URL: ", req.originalUrl);
	var handler = "backend.controllers.registerVapp";
	logger.info("Starting: ",handler);
	if(Object.keys(req.body).length != 0){
		database.insertVapp(req.body, function(isOK, data){
			if(!isOK) {
				logger.error(handler,data);
				sendResponse(500, {success: false, data:data},"Register Vapp: "+data, res);
			}else {
				logger.info(handler,data);
				if(data == "App is already registered or AppID is Null"){
					sendResponse(404, {success: true, data:data},"Register Vapp: "+data, res);	
				}else{
					sendResponse(200, {success: true, data:data},"Register Vapp: Successfully", res);
				}
			}
		});
	}else{
		logger.error(handler);
		res.end();
	}
}

/*
Description: Module for create Notifications
Input:
	req: JSON Body
Output: true(200)/false(500)
*/
module.exports.createNotifications= function (req, res) {
	logger.info("Request type: ",req.method, "Request URL: ", req.originalUrl);
	var handler = "backend.controllers.createNotifications";
	logger.info("Starting: ",handler);
	//Check if request body is not empty
	if(Object.keys(req.body).length != 0){
		//Check if Token Exists
		database.checkIfTokenExists(req.body.token, function(isOK, reason){
			if(isOK) {
				controllerNotification.notificationHandler(req.body.body, req.body.token, function(ifOK, reason, notificationsCreated){
					if(isOK) {
						if(reason.includes("There is no Rules for this vApp :")){
							sendResponse(404, {success: true, reason:reason},"Notification: " + reason, res);
						}else{
							//execute smart system for rules creation
							smartSystem.smartRulesHandler();
							//execute email based on the reason
							controllerNotification.cronDispatcher(reason);
							//execute http request based on the reason
							controllerNotification.cronDispatcherHTTPRequest(reason);
							sendResponse(200, {success: true, reason:reason},"Notification: Successfully", res);
						}
					}else {
						sendResponse(500, {success: false, reason: reason},"Notification: "+reason, res);
					}
				});
			}else{
				logger.error(handler);
				sendResponse(500, {success: false, reason: reason},"Check Token: "+reason, res);
				res.end();
			}
		});
	}
}

/*
Description: Module for create Rules
Input:
	req: JSON Body
Output: true(200)/false(500)
*/
module.exports.createNotificationsRules= function (req, res) {
	logger.info("Request type: ",req.method, "Request URL: ", req.originalUrl);
	var handler = "backend.controllers.createNotificationsRules";
	logger.info("Starting: ",handler);
	if(Object.keys(req.body).length != 0){
		database.insertNotificationRules(req.body.body, function(isOK, data){
			if(isOK) {
				logger.info(handler,data);
				sendResponse(200, {success: true, data:data},"Create Rules: Successfully", res);
			}else {
				logger.info(handler,data);
				sendResponse(500, {success: false, data:data},"Create Rules: "+data, res);		
			}
		});	
	}else{
		logger.error(handler);
		res.end();
	}
}

/*
Description: Module for Get Notifications
Input:
	req: AppID
Output: true(200)/false(500)
*/
module.exports.getNotifications= function (req, res) {
	logger.info("Request type: ",req.method, "Request URL: ", req.originalUrl);
	var handler = "backend.controllers.getNotifications";
	logger.info("Starting: ",handler); 
	appid = req.params.appid;
	database.retrieveNotificationList(appid, function(isOK, rows){
		if(!isOK) {
			logger.info(handler,rows);
			sendResponse(500, {success:false, data:rows},"Get Notifications: "+rows, res);
		}else {
			logger.info(handler,rows);
			if(rows == "AppID Incorrect"){
				sendResponse(404, {success: true, data:rows},"Get Notifications: ",res);
			}else{
				sendResponse(200, {success: true, data:rows},"Get Notifications: Successfully",res);
			}
		}
	});
}

/*
Description: Module for Get vApps
Input:
	req: DeveloperID
Output: true(200)/false(500)
*/
module.exports.getApps= function (req, res) {
	logger.info("Request type:",req.method, "Request URL:", req.originalUrl);
	var handler = "backend.controllers.getApps";
	logger.info("Starting: ",handler); 
	developerid = req.params.developerid;
	database.retrieveApp(developerid, function(isOK, rows){
		if(!isOK) {
			logger.info(handler,rows);
			sendResponse(500, {success:false, data:rows},"Get Vapps: "+rows,res);
		}else {
			logger.info(handler,rows);
			if(rows == "DeveloperID does not exist"){
				sendResponse(404, {success: true, data:rows},"Get Vapps: "+rows,res);
			}else{
				sendResponse(200, {success: true, data:rows},"Get Vapps: Successfully",res);
			}
		}
	});
}

/*
Description: Module for Get Rules
Input:
	req: AppID
Output: true(200)/false(500)
*/
module.exports.getRules= function (req, res) {
	logger.info("Request type:",req.method, "Request URL:", req.originalUrl);
	var handler = "backend.controllers.getRules";
	logger.info("Starting: ",handler);  
	appid = req.params.appid;
	database.retrieveRulesList(appid, function(isOK, rows){
		if(!isOK) {
			logger.info(handler,rows);
			sendResponse(500, {success:false, data:rows},"Get Rules: " + rows,res);
		}else {
			logger.info(handler,rows);
			if(rows == "AppID Incorrect"){
				sendResponse(404, {success: true, data:rows},"Get Rules: " + rows,res);
			}else{
				sendResponse(200, {success: true, data:rows},"Get Rules: Successfully",res);
			}
		}
	});
}

/*
Description: Module for Get Statistics
Input:
	req: RuleID
Output: true(200)/false(500)
*/
module.exports.getStatistics= function (req, res) {
	logger.info("Request type:",req.method, "Request URL:", req.originalUrl);
	var handler = "backend.controllers.getStatistics";
	logger.info("Starting: ",handler);  
	rulesid = req.params.rulesid;
	database.retrieveStatisticsList(rulesid, function(isOK, rows, total){
		if(!isOK) {
			logger.info(handler,rows);
			sendResponse(500, {success:false, data:rows,total},"Get Statistics: "+rows,res);
		}else {
			logger.info(handler,rows);
			if(rows == "RuleID Incorrect"){
				sendResponse(404, {success: true, data:rows},"Get Statistics: "+rows,res);
			}else{
				sendResponse(200, {success: true, data:rows,total},"Get Statistics: Successfully",res);
			}
		}
	});
}

/*
Description: Module for Delete vApp
Input:
	req: AppID
Output: true(200)/false(500)
*/
module.exports.deleteVapp= function (req, res) {
	logger.info("Request type:",req.method, "Request URL:", req.originalUrl);
	var handler = "backend.controllers.deleteVapp";
	logger.info("Starting: ",handler);  
	appid = req.params.appid;
	database.deleteVapp(appid, function(isOK, data){
		if(!isOK) {
			logger.info(handler,data);
			sendResponse(500, {success:false, data:data},"Delete Vapp: "+data,res);
		}else {
			logger.info(handler,data);
			if(data == "AppID Incorrect"){
				sendResponse(404, {success: true, data:data},"Delete Vapp: "+data,res);
			}else{
				sendResponse(200, {success: true, data:data},"Delete Vapp: Successfully",res);
			}
		}
	});
}

/*
Description: Module for Delete Rule
Input:
	req: RuleID
Output: true(200)/false(500)
*/
module.exports.deleteRule= function (req, res) {
	logger.info("Request type:",req.method, "Request URL:", req.originalUrl);
	var handler = "backend.controllers.deleteRule";
	logger.info("Starting: ",handler);  
	rulesid = req.params.rulesid;
	database.deleteRule(rulesid, function(isOK, data){
		if(!isOK) {
			logger.info(handler,data);
			sendResponse(500, {success:false, data:data},"Delete Rule: "+data,res);
		}else {
			logger.info(handler,data);
			if(data == "RuleID Incorrect"){
				sendResponse(404, {success: true, data:data},"Delete Rule: "+data,res);
			}else{
				sendResponse(200, {success: true, data:data},"Delete Rule: Successfully",res);
			}
		}
	});
}

/*
Description: Module for Edit Rule
Input:
	req: JSON Body
Output: true(200)/false(500)
*/
module.exports.editRule= function (req, res) {
	logger.info("Request type: ",req.method, "Request URL: ", req.originalUrl);
	var handler = "backend.controllers.editRule";
	logger.info("Starting: ",handler);
	var response = [];
	if(Object.keys(req.body).length != 0){
		database.updateRule(req.body.body, function(isOK, data){
			if(!isOK) {
				logger.info(handler,data);
				sendResponse(500, {success: false, response:response},"Update Rule: "+data,res);
			}else {
				logger.info(handler,data);
				sendResponse(200, {success: true, response:response},"Update Rule: Successfully",res);				
			}
		});
	}else{
		logger.error(handler);
		res.end();
	}
}

/*
Description: Module for Get All Rule
Input:
	req: RuleID
Output: true(200)/false(500)
*/
module.exports.getAllRule= function (req, res) {
	logger.info("Request type: ",req.method, "Request URL: ", req.originalUrl);
	var handler = "backend.controllers.getNotifications";
	logger.info("Starting: ",handler); 
	rulesid = req.params.rulesid;
	database.retrieveAllRule(rulesid, function(isOK, rows){
		if(!isOK) {
			logger.info(handler,rows);
			sendResponse(500, {success:false, data:rows},"Get All Specific Rule: "+rows, res);
		}else {
			logger.info(handler,rows);
			if(rows == "RuleID incorrect"){
				sendResponse(404, {success: true, data:rows},"Get All Specific Rule: "+rows,res);
			}else{
				sendResponse(200, {success: true, data:rows},"Get All Specific Rule: Successfully",res);
			}
		}
	});
}

/*
Description: Function to Send Response
Input:
	statusCode: 200/500
	JSONbody: JSON
	type: String
Output: true(200)/false(500)
*/
function sendResponse(statusCode, JSONbody, type, res){
	var handler = "backend.controllers.sendResponse";
	logger.info(type); 
	//console.log("Sending response to " + type);
	//console.log(type);
	res.writeHead(statusCode, {'Content-type': 'application/json'});
	res.write(JSON.stringify(JSONbody));
	res.end();
}
