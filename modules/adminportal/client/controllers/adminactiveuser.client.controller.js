/**
 * Created by anshal on 02-12-16.
 */

'use strict';

angular.module('adminportal').controller('AdminActiveUser', ['$scope','$timeout','$http', '$state', 'Authentication','Users',
    function ($scope, $timeout, $http, $state, Authentication, Users) {



        //$scope.options={};

        $http.get('/api/users').then(function success(res){
            console.log(res.data);
            $scope.profile = res.data;
        }, function error(err){
            console.log(err);
        });

        $scope.showProfile = function(obj) {
            $state.go('adminportal.activeUsers',{uid : obj});
        }


    }
]);
