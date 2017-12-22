/**
 * Created by arunsharma on 6/2/16.
 */
'use strict';


module.exports = function(app) {
    var events = require('../controllers/event.server.controller');
    var path = require('path'),
        usersPolicy = require(path.resolve('./modules/users/server/policies/admin.server.policy.js'));

    app.route('/api/events').get(events.list);
    app.route('/api/v2/events').post(events.listPaged);
    app.route('/api/v2/events/love').post(events.love);
    app.route('/api/events/edit/:eid').get(usersPolicy.isAllowed,events.eventbyId);
    app.route('/api/events/filtered').post(events.listByFilters);
    app.route('/api/events/listAllById').post(usersPolicy.isAllowed,events.listAllById);
    app.route('/api/events/show/:id').get(events.show);
    app.route('/api/v2/events/show').post(events.showById);
    app.route('/api/events/create').post(events.create);
    app.route('/api/v2/events/create').post(events.v2_create);
    app.route('/api/v2/events/update').post(events.v2_update);
    app.route('/api/events/update').post(events.update);
    app.route('/api/events/invites').get(events.getInvites);
    app.route('/api/events/invites/accept').post(events.acceptEvent);
    app.route('/api/v2/events/invites/accept').post(events.acceptEventByUID);
    app.route('/api/events/invites/decline').post(events.declineInvite);
    app.route('/api/v2/events/accepted/decline').post(events.declineInviteByUID);
    app.route('/api/events/accepted').get(events.getAccepted);
    app.route('/api/v2/events/accepted').post(events.v2_getAccepted);
    app.route('/api/events/accepted/search').get(events.searchAccepted);
    app.route('/api/events/accepted/decline').post(events.declineEvent);
    app.route('/api/events/create/upload').post(events.upload);
    app.route('/api/events/saveimage').post(events.saveImage);
    app.route('/api/events/getloyalty').post(events.getLoyalty);

    //find all events created by ambassdors
    app.route('/api/events/listByCreator').post(usersPolicy.isAllowed, events.listByCreator);
    //find all events of user by creator id
    app.route('/api/v2/events/listByCreator').post( events.listByCreatorID);

    //deals related apis
    app.route('/api/v2/deals').get(events.getDeals);
    app.route('/api/v2/deals/create').post(events.createDeal);
    app.route('/api/v2/deals/get').get(events.getDeal);
    app.route('/api/v2/events/attach').post(events.attachDealToEvent);

    app.route('/api/v2/events/pay').post( events.pay);

};
