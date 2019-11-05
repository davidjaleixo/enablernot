/*made by Miguel Rodrigues @ KBZ miguel.rodrigues@knowledgebiz.pt*/

var winston = require('winston');
var configuration = require('../config.json');

module.exports = mylogger = new (winston.Logger)({
	level: configuration.Logger.DEBUGLEVEL,
	transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: 'notification.log' })
    ]
});

