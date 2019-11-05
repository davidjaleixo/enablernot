/*made by Miguel Rodrigues @ KBZ miguel.rodrigues@knowledgebiz.pt*/

//httpRequest to send Notification by HTTP Request

var logger = require('../config/logger.js');
var http =   require("http");

var handler = "backend.controllers.httpRequest";

/*
Description: Sends an Http Request using the Http Request setup
Input:
  hostname: String with the hostname of Http Request
  port: Integer with the port of Http Request
  path: String with the path of Http Request
  method: String with the method of Http Request
  notification: String with the email body
*/
module.exports.sendHttpRequest = function (hostname, port, path, method, notification) {
  var options = {
    hostname: hostname,
    port: port,
    path: path,
    method: method,
    headers: {
      'Content-Type': 'application/json',
    }
  };
  
  var req = http.request(options, function(res) {
    //console.log('Status: ' + res.statusCode);
    logger.info(handler, res.statusCode);
    //console.log('Headers: ' + JSON.stringify(res.headers));
    logger.info(handler, JSON.stringify(res.headers));

    res.setEncoding('utf8');
    res.on('data', function (body) {
      //console.log('Body: ' + body);
      logger.info(handler, body);
    });
  });

  req.on('error', function(e) {
    //console.log('problem with request: ' + e.message);
    logger.error(handler, e.message);
  });

  // write data to request body
  req.write(JSON.stringify(notification));
  req.end();
}
