'use strict';

module.exports = function(app) {
    var loyalty = require('../controllers/loyalty.server.controller');
    var loyaltyPlan = require('../controllers/loyaltyPlan.server.controller');
    var loyaltyHistory = require('../controllers/loyaltyHistory.server.controller');
    var path = require('path'),
        usersPolicy = require(path.resolve('./modules/users/server/policies/admin.server.policy.js'));

    app.route('/api/loyalties/plans').get(usersPolicy.isAllowed, loyaltyPlan.list);
    app.route('/api/loyalties/plans/update').post(usersPolicy.isAllowed, loyaltyPlan.update);
    app.route('/api/loyalties/plans/delete').post(usersPolicy.isAllowed, loyaltyPlan.delete);

    app.route('/api/loyalties/history/get').post(loyaltyHistory.get);

    app.route('/api/loyalties/loyalty/get').get(loyalty.get);
}
