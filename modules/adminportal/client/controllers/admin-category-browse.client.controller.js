/**
 * Created by anshal on 2/21/2016.
 */
'use strict';

angular.module('adminportal').controller('CategoryBrowseController', ['$scope','$timeout','$http', '$state', 'Authentication','Users',
    function ($scope, $timeout, $http, $state, Authentication, Users) {
        $http.get('/api/categories').then(function success(res){
            console.log(res.data);
            $scope.categories = res.data;
        }, function error(err){
            console.log(err);
        });

        $scope.showSategory = function(obj) {
            $state.go('adminportal.browsecat',{uid : obj});
        }
        $scope.deleteCat = function (isValid) {

            $http.post("/api/categories/delete",$scope.category).success(function(resp){
                    console.log("category deleted!");
                    $state.go("adminportal.category.browsecat");
                })
                .error(function(err){
                    console.log(err);
                });
            return false;

        };

    }
    ]);
