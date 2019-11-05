/*made by Miguel Rodrigues @ KBZ miguel.rodrigues@knowledgebiz.pt*/

var mysql =  require('mysql');
var token =  require ('../backend/token/tokenGenerator');
var dbpool =    require ('../backend/server');
var email =  require('./emailer');
var logger = require('../config/logger.js'); 

/*
Description: Function for Handler Database
Input:
	query: String with query
Output: true/false
*/
function handlerDB (query, cb){
	dbpool.getConnection(function(err, conn){
		if(err){
			logger.error("handlerDB",err);
			cb(true, err);
		}
		logger.info("handlerDB","connected as id ", conn.threadId);
		conn.query(query,function(err, rows){
			conn.release();
			if(!err){
				cb(false, rows)
			}
		})
		conn.on('error', function(err){
			logger.error("handlerDB","error on database connection");
		})
	})
}

/*
Description: Module for Insert vApp on Database
Input:
	body: JSON Body
Output: true/false with message
*/
module.exports.insertVapp= function(body, callback){
	var response = [];
	var bool = false;
	body.appID.forEach(function(eachBody, bodyIndex){
		var sqlQuery = "SELECT appID FROM registration where appID = '"+eachBody+"'";
		handlerDB(sqlQuery, function(err, result){
			if (err){
				callback(false, err);
			}
			else{
				if(result.length == 0 && eachBody != null && eachBody.length > 0){
					var newToken = token.token_generator();
					var sqlQuery = "INSERT INTO registration ( token, appID, developerID) VALUES ('"+newToken+"','"+eachBody+"','"+body.developerID[bodyIndex]+"')";
					handlerDB(sqlQuery, function(err, result){
						if(err){
							callback(false, err);
						}else{
							email.sendEmailToken(body.developerID[bodyIndex], newToken);
							response.push({token: newToken});
							bool = true;
							if(bodyIndex == body.appID.length - 1){
								callback(true,response);
							}
						}
					})
				}
				else{
					response.push({token: "App is already registered or AppID is Null"});
					if(bodyIndex == body.appID.length - 1){
						if(bool == true){
							callback(true,response);
						}else{
							callback(true,"App is already registered or AppID is Null");
						}
					}
				}
			}
		})
	})
}

/*
Description: Module for Insert Notifications on Database
Input:
	data: JSON Body
Output: true/false with message
*/
module.exports.insertNotification= function(data, callback){
	strSubject = data.subject + " = " + data.subjectValue;
	var sqlQuery = "INSERT INTO notificationlist ( subject, token, rulesID) VALUES ('"+strSubject+"', '"+data.token+"', '"+data.rulesID+"')";
	handlerDB(sqlQuery, function(err, result){
		if (err){
			callback(false,err);
		}
		else{
			callback(true, result);
		}
	})
}

/*
Description: Module for Insert Rules on Database
Input:
	body: JSON Body
Output: true/false with message
*/
module.exports.insertNotificationRules= function(body, callback){
	var response = [];
	body.forEach(function(eachBody, bodyIndex){
		if(eachBody.hasOwnProperty('token')){
			var sqlQuery = "INSERT INTO ruleslist ( description, parameter, conditionValue, controlValue, threshold, notifyType, emailTo, notificationType, hostname, port, path, method, token) VALUES ('"+eachBody.description+"','"+eachBody.parameter+"','"+eachBody.conditionValue+"','"+eachBody.controlValue+"','"+eachBody.threshold+"','"+eachBody.notifyType+"','"+eachBody.emailTo+"','"+eachBody.notificationType+"','"+eachBody.hostname+"','"+eachBody.port+"','"+eachBody.path+"','"+eachBody.method+"','"+eachBody.token+"')";
			handlerDB(sqlQuery, function(err, result){
				if (err){
					callback(false,err);
				}else {
					callback(true);
				}
			});
		}else{
			var destinations ="";
			for(i = 0; i < eachBody.emailTo.length; i++){
				if(eachBody.emailTo[i] == null && eachBody.emailTo.length == 1){
					destinations = null;
				}else{
					if(eachBody.emailTo[i] != null){
						destinations += eachBody.emailTo[i];
						if(i < eachBody.emailTo.length - 1 && eachBody.emailTo.length != 1){
							destinations += ","
						}
					}
				}
			}
			var sql = "SELECT token FROM registration where appID = '"+eachBody.appID+"'";
			handlerDB(sql, function(err, res){
				if (err){
					callback(false,err);
				}else{
					if(res.length == 0){
						response.push({description:eachBody.description, reason: "AppID incorrect"});
						if(bodyIndex == body.length - 1){
							callback(true, response);
						}
					}else{
						switch(eachBody.conditionValue){
							case ">":
							case ">=":
							if(eachBody.threshold > 100){
								response.push({description:eachBody.description, reason:"Fail! Threshold have to be Lower then 100"});
								if(bodyIndex == body.length - 1){
									callback(true, response);
								}
							}else{
								if(eachBody.notifyType == "Email"){
									var sqlQuery2 = "INSERT INTO ruleslist ( description, parameter, conditionValue, controlValue, threshold, notifyType, emailTo, notificationType, hostname, port, path, method, token) VALUES ('"+eachBody.description+"','"+eachBody.parameter+"','"+eachBody.conditionValue+"','"+eachBody.controlValue+"','"+eachBody.threshold+"','"+eachBody.notifyType+"','"+destinations+"','"+eachBody.notificationType+"','null','0','null','null','"+res[0].token+"')";
									handlerDB(sqlQuery2, function(err, result){
										if (err){
											callback(false,err);
										}else {
											response.push({description:eachBody.description, ruleId: result.insertId, reason:"Success"});
											if(bodyIndex == body.length - 1){
												callback(true, response);
											}
										}
									});
								}else if(eachBody.notifyType == "HTTP Request"){
									var sqlQuery2 = "INSERT INTO ruleslist ( description, parameter, conditionValue, controlValue, threshold, notifyType, emailTo, notificationType, hostname, port, path, method, token) VALUES ('"+eachBody.description+"','"+eachBody.parameter+"','"+eachBody.conditionValue+"','"+eachBody.controlValue+"','"+eachBody.threshold+"','"+eachBody.notifyType+"','null','0','"+eachBody.hostname+"','"+eachBody.port+"','"+eachBody.path+"','"+eachBody.method+"','"+res[0].token+"')";
									handlerDB(sqlQuery2, function(err, result){
										if (err){
											callback(false,err);
										}else {
											response.push({description:eachBody.description, ruleId: result.insertId, reason:"Success"});
											if(bodyIndex == body.length - 1){
												callback(true, response);
											}
										}
									});
								}else{
									response.push({description:eachBody.description, reason:"Fail! NotifyType is Wrong, only can be: Email or HTTP Request"});
									if(bodyIndex == body.length - 1){
										callback(true, response);
									}
								}
							}
							break;
							case "<":
							case "<=":
							if(eachBody.threshold < 100){
								response.push({description:eachBody.description, reason:"Fail! Threshold have to be Higher then 100"});
								if(bodyIndex == body.length - 1){
									callback(true, response);
								}
							}else{
								if(eachBody.notifyType == "Email"){
									var sqlQuery2 = "INSERT INTO ruleslist ( description, parameter, conditionValue, controlValue, threshold, notifyType, emailTo, notificationType, hostname, port, path, method, token) VALUES ('"+eachBody.description+"','"+eachBody.parameter+"','"+eachBody.conditionValue+"','"+eachBody.controlValue+"','"+eachBody.threshold+"','"+eachBody.notifyType+"','"+destinations+"','"+eachBody.notificationType+"','null','0','null','null','"+res[0].token+"')";
									handlerDB(sqlQuery2, function(err, result){
										if (err){
											callback(false,err);
										}else {
											response.push({description:eachBody.description, ruleId: result.insertId, reason:"Success"});
											if(bodyIndex == body.length - 1){
												callback(true, response);
											}
										}
									});
								}else if(eachBody.notifyType == "HTTP Request"){
									var sqlQuery2 = "INSERT INTO ruleslist ( description, parameter, conditionValue, controlValue, threshold, notifyType, emailTo, notificationType, hostname, port, path, method, token) VALUES ('"+eachBody.description+"','"+eachBody.parameter+"','"+eachBody.conditionValue+"','"+eachBody.controlValue+"','"+eachBody.threshold+"','"+eachBody.notifyType+"','null','0','"+eachBody.hostname+"','"+eachBody.port+"','"+eachBody.path+"','"+eachBody.method+"','"+res[0].token+"')";
									handlerDB(sqlQuery2, function(err, result){
										if (err){
											callback(false,err);
										}else {
											response.push({description:eachBody.description, ruleId: result.insertId, reason:"Success"});
											if(bodyIndex == body.length - 1){
												callback(true, response);
											}
										}
									});
								}else{
									response.push({description:eachBody.description, reason:"Fail! NotifyType is Wrong, only can be: Email or HTTP Request"});
									if(bodyIndex == body.length - 1){
										callback(true, response);
									}
								}
							}
							break;
							default:
						}
					}
				}
			})		
		}
	})
}

/*
Description: Module for Insert Statistics on Database
Input:
	result: String with true ou false
	subjectValue: String with Subject Value
	subject: String with Subject 
	rulesid: String with RuleID 
Output: true/false with message
*/
module.exports.insertStatistics = function(result, subjectValue, subject, rulesid, callback){
	var sqlQuery = "INSERT INTO statisticslist ( result, subjectValue, subject, rulesID) VALUES ('"+result+"', '"+subjectValue+"', '"+subject+"', '"+rulesid+"')";
	handlerDB(sqlQuery, function(err, result){
		if (err) {
			logger.info("Update Values for Statistics: " + err);
			callback(false,err);
		}
		else{
			logger.info("Update Values for Statistics: Success");
			callback(true, subject);
		}
	})
}

/*
Description: Module for Get vApp by DeveloperID on Database
Input:
	developerid: String with DeveloperID
Output: true/false with message
*/
module.exports.retrieveApp= function(developerid,callback){
	var sqlQuery = "SELECT * FROM registration where developerID = '"+developerid+"'";
	handlerDB(sqlQuery, function(err,result){
		if (err){
			callback(false,err);
		}
		else {
			if(result.length == 0){
				callback(true,"DeveloperID does not exist");
			}else{
				callback(true,result);
			}
		}
	})
}

/*
Description: Module for Get Notifications by NotificationsID on Database
Input:
	IDArray: String with NotificationsID
Output: true/false with message
*/
module.exports.getNotificationsByListId = function(IDArray, cb){
	handlerDB("select * from notificationlist where notificationID IN "+IDArray,function(err,res){
		if(err){
			cb(true, err)
		}else{
			cb(false, res)
		}
	})
}

/*
Description: Module for Get Notifications by AppID on Database
Input:
	appid: String with AppID
Output: true/false with message
*/
module.exports.retrieveNotificationList= function(appid,callback){
	var sql = "SELECT token FROM registration where appID = '"+appid+"'";
	handlerDB(sql, function(err, res){
		if (err){
			callback(false,err);
		}
		else{
			if(res.length == 0){
				callback(true,"AppID Incorrect");
			}else{
				var sqlQuery = "SELECT * FROM notificationlist where token = '"+res[0].token+"'";
				handlerDB(sqlQuery, function(err, rows){
					if (err){ 
						callback(false,err);
					}
					else {
						callback(true,rows);
					}
				})
			}
		}
	})
}

/*
Description: Module for Get Rules by AppID on Database
Input:
	appid: String with AppID
Output: true/false with message
*/
module.exports.retrieveRulesList= function(appid,callback){
	var sql = "SELECT token FROM registration where appID = '"+appid+"'";
	handlerDB(sql, function(err, res){
		if (err){
			callback(false,err);
		}
		else{
			if(res.length == 0){
				callback(true,"AppID Incorrect");
			}else{
				var sqlQuery = "SELECT * FROM ruleslist where token = '"+res[0].token+"'";
				handlerDB(sqlQuery, function(err, rows){
					if (err){
						callback(false,err);
					}
					else{
						callback(true,rows);
					}
				})
			}
		}
	})
}

/*
Description: Module for Get Statistics by RulesID on Database
Input:
	ruleid: String with RuleID
Output: true/false with message
*/
module.exports.retrieveStatisticsList = function(ruleid, callback){
	var handler = "retrieveStatisticsList";
	var totalNotifications = 0;
	var totalNotificationsApplyByRules = 0;
	var totalValue = 0;
	var averageValue = null;
	var percentage = null;

	var sql = "SELECT token FROM ruleslist where rulesID = '"+ruleid+"'";
	handlerDB(sql, function(err, res){
		if (err){
			callback(false,err);
		}
		else{
			if(res.length == 0){
				callback(true,"RuleID Incorrect");
			}else{
				var sqlQuery = "SELECT * FROM statisticslist where rulesID = '"+ruleid+"'";
				handlerDB(sqlQuery, function(err, rows){
					if (err) {
						logger.error(handler,err);
						callback(false,err);
					}
					totalNotifications = rows.length;

					if(totalNotifications == 0){
						totalNotifications = 0;
						totalValue = 0;
						totalNotificationsApplyByRules = 0;
						averageValue = 0.0;
						percentage = 0.0;
					}else{
						for (var i = 0; i < totalNotifications; i++){
							if(rows[i].result == "true"){
								totalNotificationsApplyByRules++;
								totalValue = parseFloat(totalValue + parseFloat(rows[i].subjectValue));
							}
							else{
								totalValue = parseFloat(totalValue + parseFloat(rows[i].subjectValue));
							}
						}
						averageValue = (totalValue / totalNotifications).toFixed(2);
						percentage = ((parseInt(totalNotificationsApplyByRules) * 100 ) /  parseInt(totalNotifications)).toFixed(2);
					}
					callback(true, rows, {totalNotifications: totalNotifications, totalNotificationsApplyByRules: totalNotificationsApplyByRules, averageValue: averageValue, percentage: percentage});
				})
			}
		}
	})
}

/*
Description: Module for Get Rules by Token on Database
Input:
	token: String with Token
Output: true/false with message
*/
module.exports.getRulesListByToken = function(token, callback){
	var sqlQuery = "SELECT * FROM ruleslist where token = '"+token+"'";
	handlerDB(sqlQuery, function(err, ruleslist){
		if (err) {
			callback(false,err);
		}
		else{
			callback(true, ruleslist);
		}
	})
}

/*
Description: Module for Get developerID by Token on Database
Input:
	token: String with Token
Output: true/false with message
*/
module.exports.getEmailTovAppByToken = function(token, callback){
	var sqlQuery = "SELECT developerID FROM registration where token = '"+token+"'";
	handlerDB(sqlQuery, function(err, developer){
		if (err) {
			callback(false,err);
		}
		else{
			callback(true, developer);
		}
	})
}

/*
Description: Module for Get Rules by RulesID on Database
Input:
	rulesID: String with RuleID
Output: true/false with message
*/
module.exports.getRulesListByRulesID = function(rulesID, callback){
	var sqlQuery = "SELECT * FROM ruleslist where rulesID = '"+rulesID+"'";
	handlerDB(sqlQuery, function(err, ruleslist){
		if (err) {
			callback(false,err);
		}
		else{
			callback(true, ruleslist);
		}
	})
}

/*
Description: Module for Get All Rules on Database
Output: true/false with message
*/
module.exports.getRulesList = function(callback){
	var sqlQuery = "SELECT * FROM ruleslist";
	handlerDB(sqlQuery, function(err, ruleslist){
		if (err) {
			callback(false,err);
		}
		else{
			callback(true, ruleslist);
		}
	})
}

/*
Description: Module for check if Token exists on Database
Input:
	token: String with Token
Output: true/false with message
*/
module.exports.checkIfTokenExists = function(token, callback){
	var sql = "SELECT token FROM registration where token = '"+token+"'";
	handlerDB(sql, function(err, res){
		if (err){
			callback(false);
		}
		else{
			if(res.length == 1){
				callback(true, res);
			}
			else{
				callback(false, "Invalid Token");
			}
		}
	})
}

/*
Description: Module for check if Rule have Automatic Rule Created by System on Database
Input:
	rule: JSON body
Output: true/false with message
*/
module.exports.checkIfRuleAutomaticExists = function(rule, callback){
	var aux = false;
	var sql = "SELECT description FROM ruleslist";
	handlerDB(sql, function(err, res){
		if (err){
			callback(false);
		}
		else{
			for(var i = 0; i < res.length; i++){
				if(res[i].description.search("System Create Automatically New rule: " + rule.description) > -1){
					aux = true;
				}
			}
		}
		if(aux == false){
			callback(false);
		}else{
			callback(true);
		}
	})
}

/*
Description: Module for Delete vApp on Database
Input:
	appid: String with AppID
Output: true/false with message
*/
module.exports.deleteVapp= function(appid, callback){
	var sql = "SELECT token FROM registration where appID = '"+appid+"'";
	handlerDB(sql, function(err, res){
		if (err){ 
			callback(false,err);
		}
		else{
			if(res.length == 0){
				callback(true,"AppID Incorrect");
			}
			else{
				var sqlNotifcations = "DELETE FROM notificationlist where token = '"+res[0].token+"'";
				handlerDB(sqlNotifcations, function(err, rows){
					if (err) {
						callback(false,err);
					}
					else{
						var sqlRules = "DELETE FROM ruleslist where token = '"+res[0].token+"'";
						handlerDB(sqlRules, function(err, rows){
							if (err) {
								callback(false,err);
							}
							else{
								var sqlQuery = "DELETE FROM registration where token = '"+res[0].token+"'";
								handlerDB(sqlQuery, function (err, rows) {
									if (err){ 
										callback(false,err);
									}
									else{
										callback(true, "Delete Vapp Successfully");
									}
								});
							}
						})
					}
				})
			}
		}
	})
}

/*
Description: Module for Delete Rule on Database
Input:
	rule: String with RuleID
Output: true/false with message
*/
module.exports.deleteRule= function(rulesid, callback){
	var sql = "SELECT rulesID FROM ruleslist where rulesID = '"+rulesid+"'";
	handlerDB(sql, function(err, res){
		if (err){ 
			callback(false,err);
		}
		else{
			if(res.length == 0){
				callback(true,"RuleID Incorrect");
			}else{
				var sqlRules = "DELETE FROM statisticslist where rulesID = '"+rulesid+"'";
				handlerDB(sqlRules, function(err, res){
					if (err) {
						callback(false,err);
					}
					else{
						var sqlQuery = "DELETE FROM ruleslist where rulesID = '"+rulesid+"'";
						handlerDB(sqlQuery, function(err, rows){
							if (err) {
								callback(false,err);
							}
							else{
								callback(true, "Delete Rule Successfully");
							}
						});
					}
				})
			}
		}
	})
}

/*
Description: Module for Update Rule on Database
Input:
	data: JSON Body
Output: true/false with message
*/
module.exports.updateRule= function(body, callback){
	var response = [];
	body.forEach(function(eachBody, bodyIndex){
		if(eachBody.hasOwnProperty('token')){
			var sqlQuery = "UPDATE ruleslist SET description = '"+eachBody.description+"', parameter = '"+eachBody.parameter+"', conditionValue = '"+eachBody.conditionValue+"', controlValue = '"+eachBody.controlValue+"', threshold = '"+eachBody.threshold+"', notifyType = '"+eachBody.notifyType+"', emailTo = '"+eachBody.emailTo+"', notificationType = '"+eachBody.notificationType+"', hostname = '"+eachBody.hostname+"', port = '"+eachBody.port+"', path = '"+eachBody.path+"', method = '"+eachBody.method+"'where rulesID = '"+eachBody.rulesid+"'";
			handlerDB(sqlQuery, function(err, result){
				if (err){
					callback(false,err);
				}else {
					callback(true);
				}
			});
		}else{
			var destinations ="";
			for(i = 0; i < eachBody.emailTo.length; i++){
				if(eachBody.emailTo[i] == null && eachBody.emailTo.length == 1){
					destinations = null;
				}else{
					if(eachBody.emailTo[i] != null){
						destinations += eachBody.emailTo[i];
						if(i < eachBody.emailTo.length - 1 && eachBody.emailTo.length != 1){
							destinations += ","
						}
					}
				}
			}
			var sql = "SELECT * FROM ruleslist where rulesID = '"+eachBody.rulesid+"'";
			handlerDB(sql, function(err, res){
				if (err){
					callback(false,err);
				}else{
					if(res.length == 0){
						response.push({description:eachBody.description, reason: "rulesID incorrect"});
						if(bodyIndex == body.length - 1){
							callback(true, response);
						}
					}else{
						switch(eachBody.conditionValue){
							case ">":
							case ">=":
							if(eachBody.threshold > 100){
								response.push({description:eachBody.description, reason:"Fail! Threshold have to be Lower then 100"});
								if(bodyIndex == body.length - 1){
									callback(true, response);
								}
							}else{
								var sqlQuery2 = "UPDATE ruleslist SET description = '"+eachBody.description+"', parameter = '"+eachBody.parameter+"', conditionValue = '"+eachBody.conditionValue+"', controlValue = '"+eachBody.controlValue+"', threshold = '"+eachBody.threshold+"', notifyType = '"+eachBody.notifyType+"', emailTo = '"+eachBody.emailTo+"', notificationType = '"+eachBody.notificationType+"', hostname = '"+eachBody.hostname+"', port = '"+eachBody.port+"', path = '"+eachBody.path+"', method = '"+eachBody.method+"'where rulesID = '"+eachBody.rulesid+"'";
								handlerDB(sqlQuery2, function(err, result){
									if (err){ 
										callback(false,err);
									}else {
										response.push({description:eachBody.description, reason:"Success"});
										if(bodyIndex == body.length - 1){
											callback(true, response);
										}
									}
								});
							}
							break;
							case "<":
							case "<=":
							if(eachBody.threshold < 100){
								response.push({description:eachBody.description, reason:"Fail! Threshold have to be Higher then 100"});
								if(bodyIndex == body.length - 1){
									callback(true, response);
								}
							}else{
								var sqlQuery2 = "UPDATE ruleslist SET description = '"+eachBody.description+"', parameter = '"+eachBody.parameter+"', conditionValue = '"+eachBody.conditionValue+"', controlValue = '"+eachBody.controlValue+"', threshold = '"+eachBody.threshold+"', notifyType = '"+eachBody.notifyType+"', emailTo = '"+eachBody.emailTo+"', notificationType = '"+eachBody.notificationType+"', hostname = '"+eachBody.hostname+"', port = '"+eachBody.port+"', path = '"+eachBody.path+"', method = '"+eachBody.method+"'where rulesID = '"+eachBody.rulesid+"'";
								handlerDB(sqlQuery2, function(err, result){
									if (err){ 
										callback(false,err);
									}else {
										response.push({description:eachBody.description, reason:"Success"});
										if(bodyIndex == body.length - 1){
											callback(true, response);
										}
									}
								});
							}
							break;
							default:
						}
					}
				}
			})	
		}
	})
}

/*
Description: Module for Get all parameters on Specific Rule on Database
Input:
	rule: String with RuleID
Output: true/false with message
*/
module.exports.retrieveAllRule= function(RuleID, callback){
	var sqlQuery = "SELECT * FROM ruleslist where rulesID = '"+RuleID+"'";
	handlerDB(sqlQuery, function(err, result){
		if (err){
			callback(false,err);
		}
		else{
			if(result.length == 0){
				callback(true, "RuleID incorrect");
			}else{
				callback(true, result);
			}
		}
	})
}

