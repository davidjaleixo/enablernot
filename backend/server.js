/*made by Miguel Rodrigues @ KBZ miguel.rodrigues@knowledgebiz.pt*/

//Start Server (npm start)

// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var constants	   = require('../constants.js');
var methodOverride = require('method-override');
var mysql	       = require('mysql');
var logger		   = require('../config/logger.js');
// Notification ===========================================

// cors enablement from CLI
process.argv.forEach((v,i,a)=>{
    if(v=='cors'){ 
        logger.info("CORS enabled from CLI");
        app.use(require('cors')())
    }
})


// Config files
var dbconfig = require('../config/db');
var configuration = require('../config.json');

//JSON Configuration File for the Email
logger.info("******************************************************");
logger.info("JSON Configuration File for the Email:");
logger.info("Using User Email: " + configuration.Email.USEREMAIL);
logger.info("Using User Password: " + configuration.Email.USERPWD);
logger.info("Using User EmailOn: " + configuration.Email.EMAILON);
logger.info("______________________________________________________");

//JSON Configuration File for Database
logger.info("JSON Configuration File for Database:");
logger.info("Using DB Host: " + configuration.Database.DBHOST);
logger.info("Using DB User: " + configuration.Database.DBUSER);
logger.info("Using DB Password: " + configuration.Database.DBPASSWORD);
logger.info("Using DB Database: " + configuration.Database.DATABASE);
logger.info("Using DB Connection Limit: " + configuration.Database.DBCONLIMIT);
logger.info("Using DB Debug: " + configuration.Database.DBDEBUG);
logger.info("______________________________________________________");

//JSON Configuration File for the Logger
logger.info("JSON Configuration File for the Logger:");
logger.info("Using User DEBUGLEVEL: " + configuration.Logger.DEBUGLEVEL);
logger.info("______________________________________________________");

//JSON Configuration File for the Enabler
logger.info("JSON Configuration File for the Enabler:");
logger.info("Using Port: " + configuration.Enabler.PORT);
logger.info("******************************************************");


// set our port
var port = configuration.Enabler.PORT || 8000; 

//using mysql connections pool
var dbpool = mysql.createPool(dbconfig);

//exports the mysql connections pool
exports = module.exports = dbpool;

// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));  

// set the static files location /public/img will be /img for users
app.use(express.static(constants.FRONTEND_PATH + '/public'));

// routes ==================================================
require('./routes')(app); // configure our routes

// start app ===============================================
// startup our app at http://localhost:3000
app.listen(port);               

logger.info("Notification Enabler is running at port", port);
//console.log("Notification Enabler is running at port", port);

// expose app           
exports = module.exports = app;