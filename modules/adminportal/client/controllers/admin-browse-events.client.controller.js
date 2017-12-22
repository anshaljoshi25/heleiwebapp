/**
 * Created by anshal on 2/21/2016.
 */
'use strict';

angular.module('adminportal').controller('AdminBrowseEvents', ['$scope','$timeout','$http', '$state', 'Authentication','Users',
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
            $state.go('adminportal.events.browse-events',{uid : obj});
        }


    }
]);
