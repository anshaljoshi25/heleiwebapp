'use strict';

module.exports = function (app) {


    var admincore = require('../controllers/adminportal.server.controller');
    var multer = require('multer');
    //var adminPolicy = require('modules/users/server/policies/admin.server.policy');

    //// Define error pages
    //app.route('/server-error').get(admincore.renderServerError);
    //
    //// Return a 404 for all undefined api, module or lib routes
    //app.route('/:url(api|modules|lib)/*').get(admincore.renderNotFound);

    // Define application route
    app.route('/adminportal/*').get(admincore.renderPortal);

};
