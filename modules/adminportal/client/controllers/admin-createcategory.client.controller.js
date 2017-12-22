/**
 * Created by anshal on 02-18-16.
 */
'use strict';

angular.module('adminportal').controller('CategoryCreateController', ['$scope','$timeout','$http', '$state', 'Authentication','Users',
    function ($scope, $timeout, $http, $state, Authentication, Users) {

        $scope.categoryPic = "test";
        $scope.markerPic="";
        $scope.submitForm = function() {
            var category = {};

            category.name = $scope.name;
            category.imgURL = $scope.categoryPic;
            category.markerImgURL=$scope.markerPic;
            $http.post("/api/categories/create",category).success(function(resp){
                    console.log("Saved event!");
                    $state.go("adminportal.category");
                })
                .error(function(err){
                    console.log(err);
                });
            return false;
        }



    }

]);
