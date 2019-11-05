/*made by Miguel Rodrigues @ KBZ miguel.rodrigues@knowledgebiz.pt*/

/*
For Testing install:
npm install mochawesome
npm install request --save
npm install chai --save
*/

var request 	= require("request");
var assert 		= require("chai").assert;
var expect		= require("chai").expect;
var constants	= require("../constants.js");
var mysql	    = require('mysql');
var dbconfig    = require('../config/db');
var base_url 	= 'http://127.0.0.1:8000';

describe("Notification Enabler BACKEND", function(){
	describe("API V0", function(){
		describe("1. Testing Database Connection", function(){
			var dbpool = mysql.createPool(dbconfig);
			it('Should Connect to Database without an error', function (done) {
				dbpool.getConnection(done);
			});
		})
		describe("2. GET " + constants.ROUTES.v0.GET.GETVAPPS + "/testingDeveloperID", function(){
			describe("2.1 Query all vApps for non-existing developerID", function(){
				it("should return status code 404", function(done){
					request.get(base_url + constants.ROUTES.v0.GET.GETVAPPS + "/testingDeveloperID", function(error,response,body){
						if(error){
							done(error);
							return;
						}
						assert.equal(response.statusCode, 404);
						done();
					})
				})
			})
			describe("2.2 Query all vApps for existing developerID", function(){
				it("should return status code 200", function(done){
					request.get(base_url + constants.ROUTES.v0.GET.GETVAPPS + "/miguel.rodrigues@knowledgebiz.pt", function(error,response,body){
						if(error){
							done(error);
							return;
						}
						assert.equal(response.statusCode, 200);
						done();
					})
				})
				it("should return response body with success true", function(done){
					request.get(base_url + constants.ROUTES.v0.GET.GETVAPPS + "/miguel.rodrigues@knowledgebiz.pt", function(error,response,body){
						if(error){
							done(error);
							return;
						}
						expect(JSON.parse(body)).to.have.property('success', true);
						assert.equal(JSON.parse(body).success, true);
						done();
					})
				})
			})
		})
		describe("3. GET " + constants.ROUTES.v0.GET.GETRULES + "/testingRuleID", function(){
			describe("3.1 Query all Rules for non-existing ruleID", function(){
				it("should return status code 404", function(done){
					request.get(base_url + constants.ROUTES.v0.GET.GETRULES + "/testingRuleID", function(error,response,body){
						if(error){
							done(error);
							return;
						}
						assert.equal(response.statusCode, 404);
						done();
					})
				})
			})
			describe("3.2 Query all Rules for existing ruleID", function(){
				it("should return status code 200", function(done){
					request.get(base_url + constants.ROUTES.v0.GET.GETRULES + "/TR37", function(error,response,body){
						if(error){
							done(error);
							return;
						}
						assert.equal(response.statusCode, 200);
						done();
					})
				})
				it("should return response body with success true", function(done){
					request.get(base_url + constants.ROUTES.v0.GET.GETRULES + "/TR37", function(error,response,body){
						if(error){
							done(error);
							return;
						}
						expect(JSON.parse(body)).to.have.property('success', true);
						assert.equal(JSON.parse(body).success, true);
						done();
					})
				})
			})
		})
		describe("4. GET " + constants.ROUTES.v0.GET.GETNOTIFICATIONS + "/testingAppID", function(){
			describe("4.1 Query all Notifications for non-existing AppID", function(){
				it("should return status code 404", function(done){
					request.get(base_url + constants.ROUTES.v0.GET.GETNOTIFICATIONS + "/testingAppID", function(error,response,body){
						if(error){
							done(error);
							return;
						}
						assert.equal(response.statusCode, 404);
						done();
					})
				})
			})
			describe("4.2 Query all Notifications for existing AppID", function(){
				it("should return status code 200", function(done){
					request.get(base_url + constants.ROUTES.v0.GET.GETNOTIFICATIONS + "/TR37", function(error,response,body){
						if(error){
							done(error);
							return;
						}
						assert.equal(response.statusCode, 200);
						done();
					})
				})
				it("should return response body with success true", function(done){
					request.get(base_url + constants.ROUTES.v0.GET.GETNOTIFICATIONS + "/TR37", function(error,response,body){
						if(error){
							done(error);
							return;
						}
						expect(JSON.parse(body)).to.have.property('success', true);
						assert.equal(JSON.parse(body).success, true);
						done();
					})
				})
			})
		})
		describe("5. GET " + constants.ROUTES.v0.GET.GETSTATISTICS + "/testingRuleID", function(){
			describe("5.1 Query all Statistics for non-existing ruleID", function(){
				it("should return status code 404", function(done){
					request.get(base_url + constants.ROUTES.v0.GET.GETSTATISTICS + "/testingRuleID", function(error,response,body){
						if(error){
							done(error);
							return;
						}
						assert.equal(response.statusCode, 404);
						done();
					})
				})
			})
			describe("5.2 Query all Statistics for existing ruleID", function(){
				it("should return status code 200", function(done){
					request.get(base_url + constants.ROUTES.v0.GET.GETSTATISTICS + "/5", function(error,response,body){
						if(error){
							done(error);
							return;
						}
						assert.equal(response.statusCode, 200);
						done();
					})
				})
				it("should return response body with success true", function(done){
					request.get(base_url + constants.ROUTES.v0.GET.GETRULES + "/5", function(error,response,body){
						if(error){
							done(error);
							return;
						}
						expect(JSON.parse(body)).to.have.property('success', true);
						assert.equal(JSON.parse(body).success, true);
						done();
					})
				})
			})
		})
		describe("6. POST " + constants.ROUTES.v0.POST.REGISTERVAPP, function(){
			describe("6.1 Create new vApp for an existing developerID", function(){
				it("should return status code 200", function(done){
					var post_data = {
						url: base_url + constants.ROUTES.v0.POST.REGISTERVAPP,
						form:{
							appID : [
							"TR47"
							],
							developerID : [
							"miguel.rodrigues@knowledgebiz.pt"
							]
						}
					};
					request.post(post_data, function(error, response, body){
						if(error){
							done(error);
							return;
						}
						assert.equal(response.statusCode, 200);
						done();
					})

				})
				it("DB should have the new vApp", function(done){
					request.get(base_url + constants.ROUTES.v0.GET.GETVAPPS + "/miguel.rodrigues@knowledgebiz.pt", function(error,response,body){
						if (error){
							done(error);
							return;
						}
						assert.equal(JSON.parse(body).data[JSON.parse(body).data.length - 2].appID, "TR47");
						done();
					})
				})
			})
			describe("6.2 Create new vApp for an existing developerID with no appID", function(){
				it("should return status code 404", function(done){
					var post_data = {
						url: base_url + constants.ROUTES.v0.POST.REGISTERVAPP,
						form:{
							appID :[ 
							""
							],
							developerID : [
							"miguel.rodrigues@knowledgebiz.pt"
							]
						}
					}
					request.post(post_data, function(error, response, body){
						if(error){
							done(error);
							return;
						}
						assert.equal(response.statusCode, 404);
						done();
					})
				})
			})
		})
		describe("7. POST " + constants.ROUTES.v0.POST.CREATERULES, function(){
			describe("7.1 Create new rule for an existing appID", function(){
				it("should return status code 200", function(done){
					var post_data = {
						url: base_url + constants.ROUTES.v0.POST.CREATERULES,
						form:{
							body:[{
								appID: "TR37",
								description: "TR47",
								parameter: "TR47",
								conditionValue: ">",
								controlValue: "47",
								threshold: "20",
								notifyType: "Email",
								notificationType: "5",
								hostname: "null",
								port: "0",
								path: "null",
								method: "null",
								emailTo: [
								"miguel.rodrigues@knowledgebiz.pt",
								"miguel.andre.rodrigues@gmail.com",
								"ma.rodrigues@campus.fct.unl.pt"
								]
							}]
						}
					};
					request.post(post_data, function(error, response, body){
						if(error){
							done(error);
							return;
						}
						assert.equal(response.statusCode, 200);
						done();
					})

				})
				it("DB should have the new rule", function(done){
					request.get(base_url + constants.ROUTES.v0.GET.GETRULES + "/TR37", function(error,response,body){
						if (error){
							done(error);
							return;
						}
						assert.equal(JSON.parse(body).data[JSON.parse(body).data.length - 1].parameter, "TR47");
						done();
					})
				})
			})
		})
		describe("8. POST " + constants.ROUTES.v0.POST.CREATENOTIFICATIONS, function(){
			describe("8.1 Create new notification for an existing token", function(){
				it("should return status code 200", function(done){
					var post_data = {
						url: base_url + constants.ROUTES.v0.POST.CREATENOTIFICATIONS,
						form:{
							token: "mV9W2cVyAitCnyx9WIT95lsGl7hbS3YSoAUZRfg6pVX",
							body: [{
								subject : "TR37",
								subjectValue : "80"
							}]
						}
					}
					request.post(post_data, function(error, response, body){
						if(error){
							done(error);
							return;
						}
						assert.equal(response.statusCode, 200);
						done();
					})

				})
				it("DB should have the new notification", function(done){
					request.get(base_url + constants.ROUTES.v0.GET.GETNOTIFICATIONS + "/TR37", function(error,response,body){
						if (error){
							done(error);
							return;
						}
						assert.equal(JSON.parse(body).data[JSON.parse(body).data.length - 1].subject, "TR37 = 80");
						done();
					})
				})
			})
			describe("8.2 Create new notification for an existing token with no subject", function(){
				it("should return status code 500", function(done){
					var post_data = {
						url: base_url + constants.ROUTES.v0.POST.CREATENOTIFICATIONS,
						form:{
							token: "0ahobLza90bTxNPF9wBYVOtMCoPOD8DMonijqthUila",
							body: [{
								subject : "",
								subjectValue : "80"
							}]
						}
					}
					request.post(post_data, function(error, response, body){
						if(error){
							done(error);
							return;
						}
						assert.equal(response.statusCode, 500);
						done();
					})
				})
			})
		})
	})
})
