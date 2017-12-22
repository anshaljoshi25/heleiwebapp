'use strict';

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller');
  var usersPolicy = require('../policies/admin.server.policy.js');

  // Setting up the users profile api
  app.route('/api/users/updateLoc').post(users.updateLoc);
  app.route('/api/users/me').get(users.me);
  app.route('/api/users').put(users.update);
  app.route('/api/v2/users/slug').post(users.slug);
  app.route('/api/v2/users/verifySlug').post(users.verifySlug);
  app.route('/api/users/accounts').delete(users.removeOAuthProvider);
  app.route('/api/users/password').post(users.changePassword);
  app.route('/api/users/picture').post(users.changeProfilePicture);
  app.route('/api/users/online').get(users.online);


  //app.route('/api/users/online').get(users.online);
  app.route('/api/users/profile/:userId').get(usersPolicy.isAllowed,users.singleProfile);

    // Finish by binding the user middleware
  app.param('userId', users.userByID);

  //friend search
  app.route('/api/users/search/friends/:searchText').get(users.searchFriends);
  // search for any user only
  app.route('/api/users/search/:searchText').get(users.searchUser);
  app.route('/api/users/search/friends').get(users.searchFriends);
  app.route('/api/users/friends/add/:uid').post(users.addAsFriend);
  app.route('/api/users/friends/remove').post(users.unFriend);
  app.route('/api/users/friends/accept/:uid').post(users.accept);
  app.route('/api/users/friends/list').get(users.listFriends);

  //upload wallImage
  app.route('/api/users/create/upload').post(usersPolicy.isAllowed,users.uploadWallImg);

  //notifs
  app.route('/api/users/notifications').get(users.notifications);
  app.route('/api/users/notifications/clear').post(users.clearNotifications);
  app.route('/api/users/notifications/archive')
      .post(usersPolicy.isAllowed,users.archiveNotifications);
  app.route('/api/users/notifications/count')
      .post(users.countNotifications);
  app.route('/api/users/notifications/clear').get(users.clearNotifications);

  //filter preferences
  app.route('/api/users/filters').get(users.filterPrefs);
  app.route('/api/users/filters/save').post(users.updateFilterPrefs);






  //version 2 of APIs

  app.route('/api/v2/users/findbyphone').post(users.findByPhone);
};
