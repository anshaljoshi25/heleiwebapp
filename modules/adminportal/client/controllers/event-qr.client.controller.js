/**
 * Created by anshal on 4/2/2016.
 */
'use strict';

angular.module('adminportal').controller('EventQrController', ['$scope','$timeout','$http', '$state', 'Authentication','Users',
    function ($scope, $timeout, $http, $state, Authentication, Users) {


        $scope.string = 'YOUR TEXT TO ENCODE';


    }

]);
