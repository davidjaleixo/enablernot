/*made by Miguel Rodrigues @ KBZ miguel.rodrigues@knowledgebiz.pt*/

//BackEnd Routes

var constants = require('../constants.js');
var controllerV0 = require('../controllers/controllerV0');

module.exports = function(app) {

    // server routes ===========================================================

    //v0 routes - POST
    app.post('/api/vf-os-enabler/v0/register', controllerV0.registerVapp);
    app.post('/api/vf-os-enabler/v0/notifications', controllerV0.createNotifications);
    app.post('/api/vf-os-enabler/v0/notification/rules/', controllerV0.createNotificationsRules);

    //v0 routes - GET
    app.get('/api/vf-os-enabler/v0/getRules/:appid', controllerV0.getRules);
    app.get('/api/vf-os-enabler/v0/getNotifications/:appid', controllerV0.getNotifications);
    app.get('/api/vf-os-enabler/v0/getApps/:developerid', controllerV0.getApps);
    app.get('/api/vf-os-enabler/v0/getStatistics/:rulesid', controllerV0.getStatistics);
    app.get('/api/vf-os-enabler/v0/getAllRule/:rulesid', controllerV0.getAllRule);

    //v0 routes - DELETE
    app.delete('/api/vf-os-enabler/v0/app/:appid', controllerV0.deleteVapp);
    app.delete('/api/vf-os-enabler/v0/rule/:rulesid', controllerV0.deleteRule);

    //v0 routes - PUT
    app.put('/api/vf-os-enabler/v0/edit', controllerV0.editRule);

    app.get('*', function(req, res) {
        res.sendFile('index.html', { root: constants.FRONTEND_PATH + '/public/views/' }); // load our public/index.html file
    });
};