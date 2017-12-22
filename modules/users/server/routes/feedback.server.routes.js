/**
 * Created by anshal on 4/1/2016.
 */
'use strict';

module.exports = function(app) {
    var feedback = require('../controllers/feedback.server.controller');

    app.route('/api/feedback/create').post(feedback.update);

}
