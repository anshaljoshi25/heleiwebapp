/**
 * Created by pardeep on 2/8/16.
 */

'use strict';

module.exports = function(app) {
    var path = require('path'),
        usersPolicy = require(path.resolve('./modules/users/server/policies/admin.server.policy.js'));
    var inbox = require('../controllers/inbox-users.server.controller');

    app.route('/api/inbox/friend/list')
        .get(usersPolicy.isAllowed,inbox.friendlist);
    app.route('/api/inbox/friend/list')
        .post(usersPolicy.isAllowed,inbox.friendlistbyId);
    app.route('/api/inbox/friend/all')
        .post(usersPolicy.isAllowed,inbox.friendAll);

    app.route('/api/inbox/friend/group')
        .get(usersPolicy.isAllowed,inbox.grouplist);
    app.route('/api/inbox/friend/group')
        .post(usersPolicy.isAllowed,inbox.grouplistbyname);

    app.route('/api/inbox/friend/add')
        .post(usersPolicy.isAllowed,inbox.friendadd);

    app.route('/api/inbox/conversation/receiveuserchat')
        .post(usersPolicy.isAllowed,inbox.receiveuserchat);

    app.route('/api/inbox/conversation/receiverecentchat')
        .post(usersPolicy.isAllowed,inbox.receiverecentchat);

    app.route('/api/inbox/conversation/receivegroupchat')
        .post(usersPolicy.isAllowed,inbox.receivegroupchat);
    app.route('/api/inbox/conversation/sendchat')
        .post(usersPolicy.isAllowed,inbox.sendchat);
    app.route('/api/inbox/conversation/deletechat')
        .post(usersPolicy.isAllowed,inbox.deletechat);
    app.route('/api/inbox/group/create')
        .post(usersPolicy.isAllowed,inbox.groupcreate);


};
