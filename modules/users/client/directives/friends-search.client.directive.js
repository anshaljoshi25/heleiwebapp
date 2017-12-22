/**
 * Created by arunsharma on 18/2/16.
 */
'use strict';

angular.module('users')
    .directive('friendsSearch',['$timeout',"$http","Authentication",function($timeout,$http,Authentication){
        return {
            restrict:'E',
            replace:true,
            templateUrl:'/modules/users/client/views/friends-search.client.view.html',
            link : function(scope,element,attr) {
                scope.me = Authentication.user;
                scope.fsFriends = [];
                scope.search = function() {
                    if(scope.searchText===''){
                        scope[attr["searcheditems"]] = [];
                        scope.fsFriends = [];
                        $timeout(function(){scope.$apply();},100);
                        return;
                    }
                    $http.get("/api/users/search/friends/"+scope.searchText).then(function success(res) {

                        scope[attr["searcheditems"]] = res.data;
                        scope.fsFriends = res.data;
                        $timeout(function(){scope.$apply();},100);
                    }, function error(err) {
                        console.log(err);
                    });
                };
                scope.callback = function(friend) {
                    scope.fsFriends=[];
                    scope.searchText = "";
                    if(attr.callback!==undefined) {
                        scope[attr["callback"]](friend);
                    }
                }


            }

        };
    }]);
