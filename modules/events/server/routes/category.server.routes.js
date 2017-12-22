/**
 * Created by arunsharma on 5/2/16.
 */
'use strict';

module.exports = function(app) {
    var categories = require('../controllers/category.server.controller');

    app.route('/api/categories').get(categories.list);
    app.route('/api/v2/categories').post(categories.listCategories);
    app.route('/api/categories/single/:cid').get(categories.editlist);
    app.route('/api/categories/create').post(categories.update);
    app.route('/api/categories/update').post(categories.updatecat);
    app.route('/api/categories/delete').post(categories.deletecat);
    app.route('/api/categories/upload').post(categories.upload);
    app.route('/api/category/count').get(categories.countAll);
}
