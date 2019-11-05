/*made by Miguel Rodrigues @ KBZ miguel.rodrigues@knowledgebiz.pt*/

//Credentials for Email which will send

var configuration = require('../config.json');

module.exports={
	userEmail: configuration.Email.USEREMAIL,
	userPwd: configuration.Email.USERPWD
}