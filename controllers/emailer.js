/*made by Miguel Rodrigues @ KBZ miguel.rodrigues@knowledgebiz.pt*/

//Emailer to to send Notification by Email

var email =       require('nodemailer');
var emailconfig = require('../config/email');
var emailbody =   require('../signature');
var logger =      require('../config/logger.js');

var handler = "backend.controllers.emailer";

var transporter= email.createTransport({
	service: "gmail",
	auth: {
		//type: 'OAuth2',
		user: emailconfig.userEmail,
		pass: emailconfig.userPwd
	}
});


/*
Description: Sends an email using the email setup
Input:
	emailTo: String Array of destinations email ex: ["destination1@email.com","destination2@email.com"]
	notification: String with the email body
*/
module.exports.sendEmail = function (emailTo,notification) {
		
	var mailOptions={
		from: emailconfig.userEmail,
		bcc: emailTo,
		subject: 'New notification!',
		html: '<h4>'+notification+'</h4>'+emailbody.signature
	};
	logger.debug("sendEmail","Recipients",mailOptions);
	transporter.sendMail(mailOptions, function(error,info){
		if(error){
			logger.error(handler, error);
		} else {
			logger.info(handler, info.response);
		}
	});
	
}

/*
Description: Sends an email using the email setup to send Token when vApp Registered
Input:
	emailTo: String Array of destinations email ex: ["destination1@email.com","destination2@email.com"]
	token: String with the token
*/
module.exports.sendEmailToken = function (emailTo,token) {
	var mailOptions={
		from: emailconfig.userEmail,
		to: emailTo,
		subject: 'New Token!',
		html: '<h4>vApp Token for Notification Enabler: <br><br>'+token+'</h4>'+emailbody.signature
	};

	transporter.sendMail(mailOptions, function(error,info){
		if(error){
			logger.error(handler, error);
			//console.log(error);
		} else {
			logger.info(handler, info.response);
			//console.log('Email sent: '+ info.response);
		}
	});
}

/*
Description: Sends an email using the email setup to inform new rule was created automatically
Input:
	emailTo: String Array of destinations email ex: ["destination1@email.com","destination2@email.com"]
	newRule: String with the email body
*/
module.exports.sendEmailNewRule = function (emailTo,newRule) {
	var mailOptions={
		from: emailconfig.userEmail,
		to: emailTo,
		subject: 'Intelligent creation of a new Rule!',
		html: '<h4>'+newRule+'<br><br></h4>'+emailbody.signature
	};

	transporter.sendMail(mailOptions, function(error,info){
		if(error){
			logger.error(handler, error);
		} else {
			logger.info(handler, info.response);
		}
	});
}
