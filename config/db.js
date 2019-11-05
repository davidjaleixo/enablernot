/*made by Miguel Rodrigues @ KBZ miguel.rodrigues@knowledgebiz.pt*/

//DB connection (MySQL)

var configuration = require('../config.json');

// Override with environment variables if necessary
configuration.Database.DBHOST = process.env.DBHOST || configuration.Database.DBHOST;
configuration.Database.DBUSER = process.env.DBUSER || configuration.Database.DBUSER;
configuration.Database.DBPASSWORD = process.env.DBPASSWORD || configuration.Database.DBPASSWORD;
configuration.Database.DATABASE = process.env.DATABASE || configuration.Database.DATABASE;
configuration.Database.DBCONLIMIT = process.env.DBCONLIMIT || configuration.Database.DBCONLIMIT;

module.exports = {
	host: configuration.Database.DBHOST,
	user: configuration.Database.DBUSER,
	password: configuration.Database.DBPASSWORD,
	database: configuration.Database.DATABASE,
	debug: false,
	connectionLimit: configuration.Database.DBCONLIMIT || 100
}