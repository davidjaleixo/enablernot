/*made by Miguel Rodrigues @ KBZ miguel.rodrigues@knowledgebiz.pt*/

//smartRuleSystem is to automatically and intelligently create new rules

var mysql  = require('../controllers/mysql');
var email  = require('../controllers/emailer');
var logger = require('../config/logger.js');
var predict = require('predict');

//Handle the rules system and creates Automatically New Rules
module.exports.smartRulesHandler = function(){
	var handler = "backend.controllers.mysql.getRulesList";
	logger.info("Starting: ",handler);
	//Get All Rules on Specific Rule
	mysql.getRulesList(function(isOK, rules){
		if(isOK){
			logger.info("GetRulesList Success");
			rules.forEach(function(eachRule, ruleIndex){
				var handler = "backend.controllers.mysql.retrieveStatisticsList";
				logger.info("Starting: ",handler);
				//Get Statistics on Specific Rule
				mysql.retrieveStatisticsList(eachRule.rulesID, function(isOK, rows, total){
					if(isOK){
						if(total.totalNotifications > 5){
							switch (eachRule.conditionValue){
								case ">":
								case ">=":
								if(eachRule.description.search("System Create Automatically New rule") > -1){
									if(total.averageValue < parseFloat(eachRule.threshold / 100)*parseFloat(eachRule.controlValue)){
										updateRule(eachRule, 0);
									}else if(total.averageValue < parseFloat(eachRule.controlValue)){
										checkLastFalseNotifications(eachRule, function(isOK, newValue){
											if(isOK) {
												updateRule(eachRule, newValue);
											}else{
												deleteRule(eachRule.rulesID);
											}
										})
									}else{
										deleteRule(eachRule.rulesID);
									}
								}else{
									checkIfExists(eachRule, function(OK, callback){
										if(!OK) {
											if(total.averageValue < parseFloat(eachRule.threshold / 100)*parseFloat(eachRule.controlValue)){
												createNewRule(eachRule, 0);
											}else if(total.averageValue < parseFloat(eachRule.controlValue)){
												checkLastFalseNotifications(eachRule, function(isOK, newValue){
													if(isOK) {
														createNewRule(eachRule, newValue);
													}
												})
											}
										}
									})
								}
								break;
								case "<":
								case "<=":
								if(eachRule.description.search("System Create Automatically New rule") > -1){
									if(total.averageValue > parseFloat(eachRule.threshold / 100)*parseFloat(eachRule.controlValue)){
										updateRule(eachRule, 0);
									}else if(total.averageValue > parseFloat(eachRule.controlValue)){
										checkLastFalseNotifications(eachRule, function(isOK, newValue){
											if(isOK) {
												updateRule(eachRule, newValue);
											}else{
												deleteRule(eachRule.rulesID);
											}
										})
									}else{
										deleteRule(eachRule.rulesID);
									}
								}else{
									checkIfExists(eachRule, function(OK, callback){
										if(!OK) {
											if(total.averageValue > parseFloat(eachRule.threshold / 100)*parseFloat(eachRule.controlValue)){
												createNewRule(eachRule, 0);
											}else if(total.averageValue > parseFloat(eachRule.controlValue)){
												checkLastFalseNotifications(eachRule, function(isOK, newValue){
													if(isOK) {
														createNewRule(eachRule, newValue);
													}
												})
											}
										}
									})
								}
								break;
								default:
							}
						}
					}
					else{
						logger.error("retrieveStatisticsList Failed: ", rows);
					}
				})
			})
		}else{
			logger.error("GetRulesList Failed: ", rules);
		}
	})
}

/*
Description: Function for Update Data on Specific Rule
Input:
	rule: Specific Rule
	newConditionValue: String with the new Condition Value
	*/
	function updateRule (rule, newConditionValue){
		var handler = "backend.controllers.mysql.updateRule";

		if(newConditionValue == 0){
			var data = {
				body:[{
					description: "System Create Automatically New rule: " + rule.description,
					parameter: rule.parameter,
					conditionValue: rule.conditionValue,
					controlValue: parseFloat(rule.threshold / 100)*parseFloat(rule.controlValue),
					threshold: rule.threshold,
					notifyType: rule.notifyType,
					notificationType: rule.notificationType,
					hostname: rule.hostname,
					port: rule.port,
					path: rule.path,
					method: rule.method,
					emailTo: rule.emailTo,
					rulesid: rule.rulesID
				}]
			};
		}else if(newConditionValue > 0){
			var data = {
				body:[{
					description: "System Create Automatically New rule: " + rule.description,
					parameter: rule.parameter,
					conditionValue: rule.conditionValue,
					controlValue: newConditionValue,
					threshold: rule.threshold,
					notifyType: rule.notifyType,
					notificationType: rule.notificationType,
					hostname: rule.hostname,
					port: rule.port,
					path: rule.path,
					method: rule.method,
					emailTo: rule.emailTo,
					rulesid: rule.rulesID
				}]
			};
		}
		mysql.updateRule(data.body, function(isOK, callback){
			if(!isOK) {
				logger.error(handler,"Fail");
			}else{
				logger.info(handler,"Success");
			}
		});
	}

/*
Description: Function for Delete Specific Rule
Input:
	rule: ruleID
	*/
	function deleteRule (rulesID){
		var handler = "backend.controllers.mysql.deleteRule";
		mysql.deleteRule(rulesID, function(isOK, callback){
			if(!isOK) {
				logger.error(handler,"Fail");
			}else{
				logger.info(handler,"Success");
			}
		})
	}

/*
Description: Function for Create New Rule (Automatically New Rule by System)
Input:
	rule: Specific Rule
	newConditionValue: String with the new Condition Value
	*/
	function createNewRule (rule, newConditionValue){
		if(newConditionValue == 0){
			var data = {
				body:[{
					description: "System Create Automatically New rule: " + rule.description,
					parameter: rule.parameter,
					conditionValue: rule.conditionValue,
					controlValue: parseFloat(rule.threshold / 100)*parseFloat(rule.controlValue),
					threshold: rule.threshold,
					notifyType: rule.notifyType,
					notificationType: rule.notificationType,
					hostname: rule.hostname,
					port: rule.port,
					path: rule.path,
					method: rule.method,
					emailTo: rule.emailTo,
					token: rule.token
				}]
			};
		}else if(newConditionValue > 0){
			var data = {
				body:[{
					description: "System Create Automatically New rule: " + rule.description,
					parameter: rule.parameter,
					conditionValue: rule.conditionValue,
					controlValue: newConditionValue,
					threshold: rule.threshold,
					notifyType: rule.notifyType,
					notificationType: rule.notificationType,
					hostname: rule.hostname,
					port: rule.port,
					path: rule.path,
					method: rule.method,
					emailTo: rule.emailTo,
					token: rule.token
				}]
			};
		}
		var handler = "backend.controllers.mysql.insertNotificationRules";
		logger.info("Starting: ",handler);
		mysql.insertNotificationRules(data.body, function(isOK, callback){
			if(!isOK) {
				logger.error("Create Automatically New Rule: Fail");
			}
			else{
				logger.info("Create Automatically New Rule: Sucess");
				var handler = "backend.controllers.mysql.getEmailTovAppByToken";
				logger.info("Starting: ",handler);
				mysql.getEmailTovAppByToken(rule.token, function(isOK, emailTo){
					if(!isOK) {
						logger.error("Error Get Email by Token");
					}
					else{
						logger.info("Success Get Email by Token");
						email.sendEmailNewRule(emailTo[0].developerID, "System Create Automatically New rule: " + rule.description);
					}
				})
			}
		})
	}

/*
Description: Function for Check if that Specific Automatically Rule Created by System Exists
Input:
	rule: Specific Rule
Output: true/false
*/
function checkIfExists (rule, cb){
	mysql.checkIfRuleAutomaticExists(rule, function(isOK, callback){
		if(!isOK) {
			logger.info("There is no Rule Created Automatically");
			cb(false);
		}
		else{
			logger.info("Rule already Created");
			cb(true);
		}
	})
}

/*
Description: Function for Check if the last 5 notifications are False
Input:
	rule: Specific Rule
Output: true/false
*/
function checkLastFalseNotifications (rule, cb){
	var prediction = predict.movingAverage(5);
	var aux = 0;
	mysql.retrieveStatisticsList(rule.rulesID, function(isOK, rows){
		if(!isOK) {
			cb(false);
		}
		else{
			if(rows.length > 0){
				rows.slice(-5).forEach(function(eachRow, index){
					if(eachRow.result == "false"){
						prediction.pushValues([parseFloat(eachRow.subjectValue)]);
						aux++;
					}
				})
				if(aux == 5){
					cb(true, prediction.predictNextValue().toFixed(2));
				}else{
					cb(false);
				}
			}else{
				cb(false);
			}
		}
	})
}