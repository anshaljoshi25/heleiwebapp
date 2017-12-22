/**
 * Created by anshal on 2/21/2016.
 */
'use strict';

angular.module('adminportal').controller('CategoryEditController', ['$scope','$timeout','$http', '$state', 'Authentication','Users',
    function ($scope, $timeout, $http, $state, Authentication, Users) {

        console.log($state.params.cid);
        $http.get('/api/categories/single/'+ $state.params.cid).then(function success(res){
            console.log(res.data);
           $scope.category = res.data;
            $scope.categoryPic = res.data.imgURL;
            $scope.markerPic = res.data.markerImgURL;
        }, function error(err){
            console.log(err);
        });

        $scope.showSategory = function(obj) {
            $state.go('adminportal.editcat',{cid:c._id});
        }
// Update a category
        $scope.updateCategory = function (isValid) {

            $scope.category.imgURL = $scope.categoryPic;
            $scope.category.markerImgURL=$scope.markerPic;
            $http.post("/api/categories/update",$scope.category).success(function(resp){
                    console.log("Saved event!");
                    $state.go("adminportal.category.browsecat");
                })
                .error(function(err){
                    console.log(err);
                });
            return false;

        };

    }
]);
