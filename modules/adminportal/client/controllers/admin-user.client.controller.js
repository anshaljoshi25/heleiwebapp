/**
 * Created by anshal on 02-15-16.
 */
'use strict';

angular.module('adminportal').controller('AdminUserController', ['$scope','$timeout','$http', 'Authentication','uiGmapGoogleMapApi','uiGmapIsReady','MarkerCreatorService','Users',
    function ($scope, $timeout, $http, Authentication, uiGmapGoogleMapApi, uiGmapIsReady, MarkerCreatorService,Users) {
        // This provides Authentication context.

        $scope.authentication = Authentication;
        $scope.user = Authentication.user;

        console.log('in admin user controller');

        //$scope.userType=[
        //    {type:'User',pcss:'panel-success',custom:'#5cb85c'},
        //    {type:'Admin',pcss:'panel-danger',custom:'#d9534f'},
        //    {type:'VenueOwner',pcss:'panel-primary',custom:'#0275d8'},
        //    {type:'Analyst',pcss:'panel-warning',custom:'#f0ad4e'},
        //    {type:'PremiumUser',pcss:'panel-primary',custom:'purple'}
        //    ];
    }
]);
