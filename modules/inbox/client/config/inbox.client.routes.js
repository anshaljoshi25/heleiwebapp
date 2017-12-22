/**
 * Created by pardeep on 2/4/16.
 */

(function () {
    'use strict';

    angular
        .module('inbox.routes')
        .config(routeConfig);


    routeConfig.$inject = ['$stateProvider'];

    function routeConfig($stateProvider) {
        $stateProvider
            .state('inbox', {
                url: '/inbox',
                templateUrl: 'modules/inbox/client/views/home.client.view.html',
                abstract:true,
                data: {
                    roles: ['user', 'admin']
                }
            })
            .state('inbox.list', {
                url: '/list',
                templateUrl: 'modules/inbox/client/views/inbox-list.client.view.html'
            })
            .state('inbox.conversation', {
                url: '/conversation/:uid',
                templateUrl: 'modules/inbox/client/views/inbox-showconversation.client.view.html'
            })
            .state('inbox.groupchat', {
                url: '/groupchat/create',
                templateUrl: 'modules/inbox/client/views/groupchat-create.client.view.html'
            })
            ;
    }
})();
