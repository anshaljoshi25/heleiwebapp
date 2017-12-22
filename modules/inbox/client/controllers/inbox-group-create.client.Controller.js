/**
 * Created by pardeep on 2/13/16.
 */


'use strict';

angular.module('inbox').controller('GroupCreateController', ['$scope','$timeout','$http', '$state', 'Authentication','Users',
    function ($scope, $timeout, $http, $state, Authentication, Users) {

        $scope.selectedfriends=[];

        $scope.userExists = function(user){

            for(var i=0;i<$scope.selectedfriends.length;i++){
                if(user.email === $scope.selectedfriends[i].email){
                    //console.log('user exists');
                    return true;
                }

            }
            return false;
        };


        $scope.selectfriend = function(user){

            if(! $scope.selectedfriends.length > 0){
                //console.log('empty array pushing user');
                $scope.selectedfriends.push(user);
            }
            else {
                //console.log('array filled array checking for repetition');
                if (!$scope.userExists(user)) {
                    $scope.selectedfriends.push(user);

                }
            }
                for (var i = 0; i < $scope.userList.length; i++) {
                    if (user.email === $scope.userList[i].email) {
                        //console.log('removing from the list');
                        $scope.userList.splice(i, 1);

                    }

                }
            //$scope.searchfriend = "";

    };

        $scope.removeuser = function(user){

            console.log('remove this '+ user.firstName);
            console.log($scope.userList);

        };

        $scope.creategroup = function(){
            var groupMembersObjID = [];
            var groupData = [];
            $scope.showNameWarning = false;
            if($scope.selectedfriends.length > 0 && $scope.groupName !== undefined && $scope.groupName.length >= 5 ){
                console.log('group created with ' +  $scope.groupName);

                for(var i=0;i<$scope.selectedfriends.length;i++){
                    groupMembersObjID.push($scope.selectedfriends[i]._id);
                }
                console.log([$scope.groupName,groupMembersObjID]);
                //groupData = [$scope.groupName,groupMembersObjID];
                $http.post('/api/inbox/group/create',{'groupData':[$scope.groupName,groupMembersObjID]})
                    .then(function success(res){
                        $state.go('inbox.list');
                    },function error(err){
                        console.log('here in creategroup');
                        console.log(err);
                    });


            }
            else{
                $scope.showNameWarning = true;
            }



        };
        $scope.showFriendProfile = function(obj){
            //console.log(obj);
            $state.go('user.profile',{uid : obj._id,ptype:'single'});
        };
    }]);

angular.module('inbox').directive('watcher',['$timeout',"$http","Authentication", function ($timeout,$http,Authentication) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            scope.$watch(attrs.ngModel, function (v) {
                scope.me = Authentication.user;
                scope.userList = [];
                if(v) {
                    console.log('I has value!'+v);
                    $http.post('/api/inbox/friend/list',{'searchfriend':v}).then(function success(res) {
                        console.log('send');
                        console.log(res.data);
                        scope.userList = res.data;
                        $timeout(function(){
                            $(".user-list-dropdown").css("margin-bottom","-"+$(".user-list-dropdown").height()+"px");
                        },100);
                    },function error(err){
                        console.log('here in directive');
                        console.log(err);
                    });
                } else {
                    console.log('I has no value :(');
                }
            });
        }
    }
}]);
