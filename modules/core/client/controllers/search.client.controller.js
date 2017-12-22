/**
 * Created by arunsharma on 1/3/16.
 */

'use strict';

angular.module('core').controller('SearchController', ['$scope','$window','$timeout','$http', '$state', 'Authentication',
    function ($scope,$window, $timeout, $http, $state, Authentication) {
        $scope.authentication = Authentication;
        $scope.people = [];
        $scope.events = [];
        $scope.categories = [];
        $scope.noResult = false;
        $scope.qloading = false;
        $scope.showTab = function($event,tab) {
            $(".active").removeClass('active');
            $(".tab-content").hide();
            $("#tab"+tab).show();
            $($event.currentTarget).addClass('active');
        };
        $(".tab-content").hide();
        $(".tab-content.active").show();

        $http.get('/api/users/friends/list').then(function(res){
            $scope.friends = res.data;
        },function(err){

        });

        var toc = null;
        $scope.search = function() {
            $timeout.cancel(toc);
            //send search query to sever and fetch all three fields
            toc = $timeout(function(){
                if($scope.searchText===undefined || $scope.searchText.length<=0){
                    return;
                }
                $http.get('/api/core/search/'+encodeURI($scope.searchText)).then(function(res){
                    //console.log(res.data);
                    $scope.people = res.data[0];
                    $scope.events = res.data[1];

                },function(err){

                });


            },1000);

        };
        var showHideLoader = function(id){
            $("#user_"+id+" .col .btn i").toggle();
            $("#user_"+id+" .col .btn .loader").toggle();
        };
        $scope.addFriend = function(u) {
            showHideLoader(u._id);
            $http.post("/api/users/friends/add/"+ u._id).then(function(s){
                showHideLoader(u._id);
                $scope.friends = s.data;
            },function(e){
                showHideLoader(u._id);
                console.log(e);
            });
        };
        $scope.accept = function(u) {
            showHideLoader(u._id);
            $http.post("/api/users/friends/accept/"+ u._id).then(function(s){
                showHideLoader(u._id);
                $scope.friends = s.data;
            },function(e){
                showHideLoader(u._id);
                console.log(e);
            });
        };
        $scope.decline = function(u) {
            var c = $window.confirm("Press OK to decline request.");
            if(!c) {
                return;
            }
            showHideLoader(u._id);
            $http.post("/api/users/friends/remove/",u).then(function(s){
                showHideLoader(u._id);
                $scope.friends = s.data;
            },function(e){
                showHideLoader(u._id);
                console.log(e);
            });
        };


        $scope.checkFriend = function(u) {
            if($scope.friends===undefined)
            return false;
            for(var i=0;i<$scope.friends.length;i++) {
                if($scope.friends[i].friend._id+""=== u._id+"" || $scope.friends[i].user._id+""=== u._id+"") {
                    return true;
                }
            }
            return false;
        };

        $scope.checkFriendWithStatus = function(u,s) {
            if($scope.friends===undefined)
                return false;
            for(var i=0;i<$scope.friends.length;i++) {
                if(($scope.friends[i].friend._id+""=== u._id+"" || $scope.friends[i].user._id+""=== u._id+"") && $scope.friends[i].status===s) {
                    return true;
                }
            }
            return false;
        };

        $scope.friendRequestSent = function(u,status) {
            if($scope.friends===undefined)
                return false;
            for(var i=0;i<$scope.friends.length;i++) {
                if(($scope.friends[i].friend._id+""=== u._id+"") && $scope.friends[i].status===status) {
                    return true;
                }
            }
            return false;
        };

        $scope.friendRequestReceived = function(u,status) {
            if($scope.friends===undefined)
                return false;
            for(var i=0;i<$scope.friends.length;i++) {
                if(($scope.friends[i].user._id+""=== u._id+"") && $scope.friends[i].status===status) {
                    return true;
                }
            }
            return false;
        };

        $scope.showEvent = function(event){
            $state.go('events.show',{eid : event._id});
        }
    }]);
angular.module('core').filter('parseDate1', function($filter) {
    return function(input) {
        if(input == null){ return ""; }

        var _date = $filter('date')(new Date(input), 'MMM dd yyyy');

        return _date.toLowerCase();

    };
});
