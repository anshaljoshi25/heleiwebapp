/**
 * Created by anshal on 02-15-16.
 */

'use strict';

angular.module('adminportal').controller('AdminListEvents', ['$scope','$timeout','$http', '$state', 'Authentication','Users',
    function ($scope, $timeout, $http, $state, Authentication, Users) {
       // $scope.events=[];

        //$scope.options={};

        $http.get('/api/events').then(function success(res){
            console.log(res.data);
            $scope.events = res.data;
        }, function error(err){
            console.log(err);
        });

        $scope.showEvents = function(obj) {
            $state.go('adminportal.listEvents',{uid : obj});
        }


    }
]);
