'use strict';

module.exports = function (app) {
  // Root routing
  var core = require('../controllers/core.server.controller');

  //sms api
  app.route('/api/v2/sms/sendMultiple').post(core.smsMulti);

  app.route('/api/core/search/:searchText').get(core.search);
  app.route('/api/v2/core/searchEvents').post(core.searchEvents);
  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  app.route('/x80s64r6.htm').get(core.renderCode);
  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  app.route('/v2/*').get(core.renderVersion2);
  // Define application route
  app.route('/*').get(core.renderIndex);


};
