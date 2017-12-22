'use strict';

angular.module('adminportal').controller('AdminMenuController', ['$scope','$timeout','$http', 'Authentication','Users',
    function ($scope, $timeout, $http, Authentication, uiGmapGoogleMapApi, uiGmapIsReady, MarkerCreatorService,Users) {
        // This provides Authentication context.

        $scope.authentication = Authentication;
        $scope.user = Authentication.user;
    }
]);
