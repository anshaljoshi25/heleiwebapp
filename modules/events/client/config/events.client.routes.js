(function () {
    'use strict';

    angular
        .module('events.routes')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider'];

    function routeConfig($stateProvider) {
        $stateProvider
            .state('events', {
                url: '/events',
                templateUrl: 'modules/events/client/views/home.client.view.html',
                abstract:true
            })
            .state('events.list', {
                url: '/list',
                templateUrl: 'modules/events/client/views/events-list.client.view.html'
            })
            .state('events.create', {
                url: '/create',
                templateUrl: 'modules/events/client/views/events-create.client.view.html'
            })
            .state('events.show', {
                url: '/show/:eid',
                templateUrl: 'modules/events/client/views/events-show.client.view.html'
            })
            .state('events.edit', {
                url: '/edit/:eid',
                templateUrl: 'modules/events/client/views/events-create.client.view.html'
            })
            .state('events.invite', {
                url: '/invite/:eid',
                templateUrl: 'modules/events/client/views/events-invitation.client.view.html'
            });
    }
})();
