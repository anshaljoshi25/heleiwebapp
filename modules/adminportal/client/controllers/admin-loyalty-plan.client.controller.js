/**
 * Created by anshal on 2/21/2016.
 */
'use strict';

angular.module('adminportal').controller('LoyaltyPlanController', ['$scope','$timeout','$http', '$state', 'Authentication','Users',
    function ($scope, $timeout, $http, $state, Authentication, Users) {


        $scope.setEditMode = function(ind) {
            if($scope.addMode) {
                $scope.addMode= false;
                $scope.loyalties.splice($scope.editMode,1);
            }
            $scope.editMode = ind;
        }

        $scope.getLoyaltyPlans = function() {
            $http.get('/api/loyalties/plans').then(function success(res){
                console.log(res.data);
                $scope.loyalties = res.data;
            }, function error(err){
                console.log(err);
            });
        }
        $scope.getLoyaltyPlans();
        $scope.addMode = false;

        $scope.addNew = function() {
            if($scope.addMode) return;
            $scope.loyalties.push({type:'',points:0});
            $scope.setEditMode($scope.loyalties.length-1);
            $scope.addMode = true;
        }

        $scope.save = function(ind) {
            $http.post("/api/loyalties/plans/update",$scope.loyalties[ind]).then(function(s){
                if(s.data!==undefined) {
                    $scope.getLoyaltyPlans();
                    $scope.setEditMode(-1);
                }
            },function(e){
                console.log(e);
            });
        };

        $scope.delete = function(ind) {
            var confirm = window.confirm("Press OK to delete the loyalty plan.");
            if(!confirm) {
                return;
            }
            $http.post("/api/loyalties/plans/delete",$scope.loyalties[ind]).then(function(s){
                if(s.data.status==="OK") {
                    $scope.loyalties.splice(ind,1);
                }
            },function(e){
                console.log(e);
            });
        }
    }
    ]);
