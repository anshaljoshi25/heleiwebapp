/**
 * Created by pardeep on 2/5/16.
 */

'use strict';

angular.module('inbox')
    .directive('userList',['$timeout',"$http","Authentication",function($timeout,$http,Authentication){
        return {
            restrict:'E',
            replace:true,
            templateUrl:'/modules/inbox/client/views/inbox-userlist.client.view.html',
            link : function(scope,element,attr) {
                scope.me = Authentication.user;
                scope.usersArray=[];
                scope.$watch(attr['uarray'],function(nv,ov){
                    scope.usersArray = nv;

                });
                //console.log(scope.usersArray);
                scope.callback = function(user){

                    if(attr['callback'] !== undefined && attr['callback'].length > 0){
                        scope[attr['callback']](user);
                    }
                };

                scope.ulType = attr['type'];

            }

        };
    }]);
