'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Admin Permissions
 *
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/users',
      permissions: '*'
    }, {
      resources: '/api/users/:userId',
      permissions: '*'
    },{
      resources: '/api/loyalties/plans',
      permissions: '*'
    },{
      resources: '/api/loyalties/plans/update',
      permissions: '*'
    },{
      resources: '/api/loyalties/plans/delete',
      permissions: '*'
    },{
      resources: '/api/events/listByCreator',
      permissions: '*'
    },{
      resources: '/api/users/search',
      permissions: '*'
    },{
      resources: '/api/category/count',
      permissions: '*'
    }
    ]
  },
    {
      roles: ['user'],
      allows: [{
        resources: '/api/inbox/friend/list',
        permissions: '*'
      },{
        resources: '/api/inbox/friend/add',
        permissions: '*'
      },{
        resources: '/api/inbox/friend/list',
        permissions: '*'
      },{
        resources: '/api/users/profile/:userId',
        permissions: '*'
      },{
        resources: '/api/inbox/friend/group',
        permissions: '*'
      },{
        resources: '/api/inbox/conversation/receiveuserchat',
        permissions: '*'
      },{
          resources: '/api/inbox/conversation/receivegroupchat',
          permissions: '*'
      },{
          resources: '/api/inbox/conversation/receiverecentchat',
          permissions: '*'
      },{
        resources: '/api/inbox/conversation/deletechat',
        permissions: '*'
      },{
        resources: '/api/inbox/group/create',
        permissions: '*'
      },{
        resources: '/api/inbox/conversation/sendchat',
        permissions: '*'
      },{
        resources: '/api/inbox/friend/all',
        permissions: '*'
      },{
        resources: '/api/events/listAllById',
        permissions: '*'
      },{
        resources: '/api/users/notifications/archive',
        permissions: '*'
      },{
        resources: '/api/users/notifications/count',
        permissions: '*'
      },{
        resources: '/api/events/edit/:eid',
        permissions: '*'
      },{
        resources: '/api/users/create/upload',
        permissions: '*'
      },{
        resources: '/api/events/update',
        permissions: '*'
      },{
        resources: '/api/v2/events/update',
        permissions: '*'
      },{
        resources: '/api/v2/events/create',
        permissions: '*'
      },{
        resources: '/api/v2/events/listByCreator',
        permissions: '*'
      },{
        resources: '/api/v2/events/accepted',
        permissions: '*'
      }
    ]
    }

  ]);

};

/**
 * Check If Admin Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
