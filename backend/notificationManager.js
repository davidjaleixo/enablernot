/*made by Miguel Rodrigues @ KBZ miguel.rodrigues@knowledgebiz.pt*/

//notificationManager to check notifications with rules

var mysql  = require('../controllers/mysql');
var email  = require('../controllers/emailer');
var httprequest  = require('../controllers/httpRequest');
var logger = require('../config/logger.js');
var configuration = require('../config.json');

//Handle the notifications request
module.exports.notificationHandler = function(body, appToken, cb){
	var handler = "backend.controllers.notificationHandler";
	//log the handler name and inputarguments
	logger.info("backend.controllers.notificationHandler with payload: "+JSON.stringify(body) + ";" + JSON.stringify(appToken));
	//prepare the http response
	var response = [];
	var jobsdone = 0;
	var valueSubject = null;

	//grab the app rules list
	mysql.getRulesListByToken(appToken, function(success, rules){
		if(!success){
			logger.info(handler,"Executing callback");
			cb(false);
		}else{
			if(rules.length == 0){
				var res = "There is no Rules for this vApp : " + appToken;
				cb(true, res)
			}else{
			//iterate the body
			body.forEach(function(eachBody, bodyIndex){
				//prepare the response with some structure
				response.push({subject: eachBody.subject, subjectValue: eachBody.subjectValue, total: 0, results:[]});
				//iterate the rules list
				rules.forEach(function(eachRule, ruleIndex){
					applyRule(eachBody, eachRule, appToken, function(ruleApplied, reason){
						if(ruleApplied){
							if(!reason){
								//rule applied
								logger.debug({subject: eachBody.subject, value: eachBody.subjectValue, ruleid: eachRule.rulesID, success: true, comment:"Rule applied"})
								
								concatenateResponse(response, eachBody, eachRule, true, "Rule applied", function(concat){
									
									response = concat;
									logger.debug("bodyIndex",bodyIndex,"ruleIndex",ruleIndex);
									jobsdone++;
									logger.debug("jobsdone",jobsdone,body.length*rules.length);
									if(jobsdone == (body.length*rules.length)){
										logger.debug("Finished! bodyIndex",bodyIndex,"ruleIndex",ruleIndex, "jobsdone",jobsdone);
										cb(true, response)
									}
								});
							}else{
								if(parseFloat(eachBody.subjectValue) >= parseFloat(eachRule.controlValue)){
									valueSubject = "Subject's value higher Rule's threshold";
								}else{
									valueSubject = "Subject's value under Rule's threshold";
								}
								//rule not applied because of threshold was not exceed
								logger.debug({subject: eachBody.subject, value: eachBody.subjectValue, ruleid: eachRule.rulesID, success: false, comment:"Rule's threshold not exceed"});
								
								concatenateResponse(response, eachBody, eachRule, false, valueSubject, function(concat){
									
									response = concat;
									logger.debug("bodyIndex",bodyIndex,"ruleIndex",ruleIndex);
									jobsdone++;
									logger.debug("jobsdone",jobsdone,body.length*rules.length);
									if(jobsdone == (body.length*rules.length)){
										logger.debug("Finished! bodyIndex",bodyIndex,"ruleIndex",ruleIndex, "jobsdone",jobsdone);
										cb(true, response)
									}
								})
								valueSubject = null;
							}
						}else{
							//rule not applied
							logger.debug({subject: eachBody.subject, value: eachBody.subjectValue, ruleid: eachRule.rulesID, success: false, comment:"Rule not applied"})
							
							concatenateResponse(response, eachBody, eachRule, false, "Rule not applied",function(concat){
								
								response = concat;
								logger.debug("bodyIndex",bodyIndex,"ruleIndex",ruleIndex);
								jobsdone++;
								logger.debug("jobsdone",jobsdone,body.length*rules.length);
								if(jobsdone == (body.length*rules.length)){
									logger.debug("Finished! bodyIndex",bodyIndex,"ruleIndex",ruleIndex, "jobsdone",jobsdone);
									cb(true, response)
								}
							})
						}
					})
				})
			})
		}
	}
})
}

/*
routine to concatenate the notificationHandler response
input: response, request body, internal rule applied, success type (boolean), the comment for the rule agains the resquested body
output: response concatenated
*/
function concatenateResponse (response, body, rule, success, comment, cb){
	response.forEach(function(eachResponse){
		if(eachResponse.subject == body.subject && eachResponse.subjectValue == body.subjectValue){
			eachResponse.results.push({ruleid: rule.rulesID, success: success, comment: comment, notType: rule.notificationType})
			//increment the total
			if(success){
				eachResponse.total++;
			}
			cb(response);
		}
	})
}

//source: the incoming "subject" and "subjectValue"
//rule: the rules which we are trying to match
//token: its the app id on the DB...
//callback arguments:
//	true 			- rule applied
//	false, err 		- rule not applied because of error (err msg)
//	true, reason 	- rule not applied because values are lower/higher then controlValue defined
function applyRule(source, rule, token, cb){
	var handler = "applyRule";
	var ruleApplied = false;
	//check the rule parameter: if not exists, discard
	if(source.subject == rule.parameter){
		//prepare insertNotification input arguments
		notificationInput = {
			subject: source.subject,
			subjectValue: parseFloat(source.subjectValue),
			rulesID: rule.rulesID,
			token: token,
			ntype: rule.notificationType
		}
		switch (rule.conditionValue){
			case ">":
			ruleApplied = ( parseFloat(source.subjectValue) > parseFloat(rule.controlValue) ) ? true : false
			break;
			case "<":
			ruleApplied = ( parseFloat(source.subjectValue) < parseFloat(rule.controlValue) ) ? true : false
			break;
			case ">=":
			ruleApplied = ( parseFloat(source.subjectValue) >= parseFloat(rule.controlValue) ) ? true : false
			break;
			case "<=":
			ruleApplied = ( parseFloat(source.subjectValue) <= parseFloat(rule.controlValue) ) ? true : false
			break;
			default:
				//already covered at >= / <=
			}
			if(ruleApplied){
			//rule is applied
			logger.info(handler, "rule " + rule.rulesID + " match");

			mysql.insertNotification(notificationInput, function(notificationCreated, err){
				if(notificationCreated){
					logger.info(handler, "Notification created successfully with", JSON.stringify(err.insertId));
					statsDispatcher(true,source,rule, function(statsCreated, err){
						if(statsCreated){
							logger.info(handler, "Stats created successfully");
							cb(true);
						}else{
							logger.error(handler, err);
							cb(false, err);
						}
					})
				}else{
					logger.error(handler, err);
					cb(false, err);
				}
			})
		}else{
			//rule not applied because controlValue not checked
			logger.info(handler, "rule " + rule.rulesID + " does not match");
			statsDispatcher(false, source, rule, function(statsCreated, err){
				if(statsCreated){
					logger.info(handler, "Stats created Successfully");
					cb(true, "Threshold was not exceed");
				}else{
					logger.error(handler, err);
					cb(false, err);
				}
			});
		}
	}else{
		cb(false, "Parameter does not match")
	}
}

//ruleApplied: TRUE if it was applied properly, FALSE if source is out of value scope
function statsDispatcher(ruleApplied, source, rule, cb){
	mysql.insertStatistics(ruleApplied, source.subjectValue, source.subject, rule.rulesID, function(statsCreated, err){
		if(statsCreated){
			logger.info("statsDispatcher: Stats have been created");
			cb(true);
		}else{
			logger.error("statsDispatcher: Stats have NOT been created", err);
			cb(false, err);
		}
	})	
}

//function cronDispatcher(reason)
module.exports.cronDispatcher = function(reason){
	var handler = "cronDispatcher";

	var today = new Date();
	var endoftwoweeks = new Date();
	var endofweek = new Date();
	var endofthreedays = new Date();
	var lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

	endoftwoweeks.setDate(endoftwoweeks.getDate() + 14);
	endofweek.setDate(endofweek.getDate() + 7);
	endofthreedays.setDate(endofthreedays.getDate() + 3);

	var thiscron = [
	{
		type: 1,
		list:[],
		schedule: lastDayOfMonth.getDate(),
	},{
		type: 2,
		list:[],
		schedule: endoftwoweeks.getDate(),
	},{
		type: 3,
		list:[],
		schedule: endofweek.getDate(),
	},{
		type: 4,
		list:[],
		schedule: endofthreedays.getDate(),
	},{
		type: 5,
		list:[],
		schedule: today.getDate()
	}
	];

	reason.forEach(function(eachElem, reasonidx){
		eachElem.results.forEach(function(eachResult, resultidx){
			if(eachResult.success){
				if(eachResult.notType > 0){
					thiscron[eachResult.notType-1].proceed = true;
					thiscron[eachResult.notType-1].list.push({subject: eachElem.subject, value: eachElem.subjectValue,rule:eachResult.ruleid})
				}
			}
			//Detect the end of loop
			if(reason.length-1 == reasonidx && eachElem.results.length-1 == resultidx){

				if(configuration.Email.EMAILON){
					logger.info(handler,"Email feature is activated");
					var crontab = require('node-crontab');
					
					thiscron.forEach(function(eachCron){
						if(eachCron.proceed){
							eachCron.list.forEach(function(eachCronList){
								mysql.getRulesListByRulesID(eachCronList.rule, function(isOK, ruleslist){
									if(isOK){
										emailTo = ruleslist[0].emailTo;
										logger.info(handler,"Creating scheduled job for notification type",eachCron.type,"Destination list",emailTo,"Email Content",eachCron.list,"Scheduled for day",eachCron.schedule);
										var jobid=crontab.scheduleJob("* * * "+eachCron.schedule+" * *", function(){
											email.sendEmail(emailTo, JSON.stringify(eachCron.list));
										},null,null,false);
										logger.info(handler,"Scheduled job created with id",jobid);
									}
								})
							})
						}
					})
				}else{
					logger.info(handler, "Email feature is NOT activated");
				}
			}
		})
	})
}

//function cronDispatcherHTTPRequest(reason)
module.exports.cronDispatcherHTTPRequest = function(reason){
	var handler = "cronDispatcherHTTPRequest";

	reason.forEach(function(eachElem, reasonidx){
		eachElem.results.forEach(function(eachResult, resultidx){
			if(eachResult.success){
				mysql.getRulesListByRulesID(eachResult.ruleid, function(isOK, ruleslist){
					if(isOK){
						if(ruleslist[0].notifyType == "HTTP Request"){
							httprequest.sendHttpRequest(ruleslist[0].hostname, ruleslist[0].port, ruleslist[0].path, ruleslist[0].method, {subject: eachElem.subject, value: eachElem.subjectValue,rule:eachResult.ruleid});
						}
					}

				})
			}
		})
	})
}