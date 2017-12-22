/**
 * Created by anshal on 02-05-16.
 */
'use strict';

// Setting up route
angular.module('adminportal.admin.routes').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

         //Redirect to 404 when route not found
        $urlRouterProvider.otherwise(function ($injector, $location) {
            $injector.get('$state').transitionTo('not-found', null, {
                location: false
            });
        });

        // Home state routing
        $stateProvider
            .state('adminportal', {
                url: '/adminportal',
                templateUrl: '/modules/adminportal/client/views/admin-home.client.view.html',
                abstract : true,
                data: {
                    roles: ['admin']
                }
            })
            .state('adminportal.pay', {
                url: '/pay',
                templateUrl: '/modules/adminportal/client/views/other/admin-pay.client.view.html'
            })
            .state('adminportal.dash', {
                url: '/dash',
                templateUrl: '/modules/adminportal/client/views/adminhome-dashboard.client.view.html'
            })

            .state('adminportal.loyalty', {
                url: '/loyalty',
                templateUrl: '/modules/adminportal/client/views/loyalty/admin-loyalty.client.view.html'
            })
            .state('adminportal.loyalty.plan', {
                url: '/plan',
                templateUrl: '/modules/adminportal/client/views/loyalty/admin-loyalty-plan.client.view.html'
            })

            .state('adminportal.events', {
                url: '/events',
                templateUrl: '/modules/adminportal/client/views/event/admin-events.client.view.html'
            })
            .state('adminportal.deals', {
                url: '/deals',
                templateUrl: '/modules/adminportal/client/views/deals/admin-deals.client.view.html'
            })
            .state('adminportal.users', {
                url: '/users',
                templateUrl: '/modules/adminportal/client/views/user/admin-users.client.view.html'
            })
            .state('adminportal.settings', {
                url: '/settings',
                templateUrl: '/modules/adminportal/client/views/setting/admin-settings.client.view.html'
            })
            .state('adminportal.category', {
                url: '/category',
                templateUrl: '/modules/adminportal/client/views/category/admin-category.client.view.html'

            })
            .state('adminportal.category.createcat', {
                url: '/createcat',
                templateUrl: '/modules/adminportal/client/views/category/admin-category-create.client.view.html'
            })
            .state('adminportal.category.browsecat', {
                url: '/browsecat',
                templateUrl: '/modules/adminportal/client/views/category/admin-browse-category.client.view.html'
            })
            .state('adminportal.category.editcat', {
                url: '/editcat/:cid',
                templateUrl: '/modules/adminportal/client/views/category/admin-edit-category.client.view.html'
            })
            .state('eventqr', {
                url: '/eventqr',
                templateUrl: '/modules/adminportal/client/views/other/event-qr.client.view.html'
            })
           ;



        // helei routes



    }
]);
