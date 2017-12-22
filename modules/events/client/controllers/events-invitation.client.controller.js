/**
 * Created by sairam on 4/4/16.
 */

angular.module('events').controller('eventInvitationController', ['$scope','$timeout','$http', '$state', 'Authentication','Users','$stateParams',
    function ($scope, $timeout, $http, $state, Authentication, Users,$stateParams) {

    //console.log($stateParams.eid);

        $http.get('/api/events/show/'+$stateParams.eid).then(function success (res){


            $scope.event = res.data;
            //console.log($scope.event);
            $scope.eventName = res.data.name;


        },function error(err){
            console.log(err);
        });

        //$scope.selectedfriends=[];

        //$scope.userExists = function(user){
        //
        //    for(var i=0;i<$scope.selectedfriends.length;i++){
        //        if(user.email === $scope.selectedfriends[i].email){
        //            //console.log('user exists');
        //            return true;
        //        }
        //
        //    }
        //    return false;
        //};


        //$scope.selectfriend = function(user){
        //
        //    if(! $scope.selectedfriends.length > 0){
        //        //console.log('empty array pushing user');
        //        $scope.selectedfriends.push(user);
        //    }
        //    else {
        //        //console.log('array filled array checking for repetition');
        //        if (!$scope.userExists(user)) {
        //            $scope.selectedfriends.push(user);
        //
        //        }
        //    }
        //    for (var i = 0; i < $scope.userList.length; i++) {
        //        if (user.email === $scope.userList[i].email) {
        //            //console.log('removing from the list');
        //            $scope.userList.splice(i, 1);
        //            i--;
        //        }
        //
        //    }
        //    //$scope.searchfriend = "";
        //
        //};

        //
        //$scope.removeuser = function(user){
        //
        //    //console.log('remove this '+ user.firstName);
        //    console.log($scope.userList);
        //
        //};


        // friends list
        $scope.friends = [];
        $scope.selectedFriends = [];

        $scope.selectFriend = function(user) {
            //console.log(user);
            var found=false;
            for(var i=0;i<$scope.selectedFriends.length;i++)  {
                if(user._id === $scope.selectedFriends[i]._id) {
                    found = true;
                    $("#userblock"+user._id).css("background-color","#FFD064");
                    $("#userblock"+user._id+" #ulIconBox"+user._id).html("");
                }
            }
            if(!found) {
                $scope.selectedFriends.push(user);
                $("#userblock"+user._id).css("background-color","#DAAC44");
                $("#userblock"+user._id+" #ulIconBox"+user._id).html("<i class='glyphicon glyphicon-ok inbox-list-sideoption pull-left' />");
            }
            //console.log('in func');
            //console.log($scope.selectedFriends);


        };

        $scope.removeSelectedFriend = function(user) {
            for(var i=0;i<$scope.selectedFriends.length;i++)  {
                if(user._id === $scope.selectedFriends[i]._id) {
                    $scope.selectedFriends.splice(i,1);
                    i--;
                }
            }
        };
        Array.prototype.contains = function(v) {
            for(var i = 0; i < this.length; i++) {
                if(this[i] === v) return true;
            }
            return false;
        };

        Array.prototype.unique = function() {
            var arr = [];
            for(var i = 0; i < this.length; i++) {
                if(!arr.contains(this[i])) {
                    arr.push(this[i]);
                }
            }
            return arr;
        };
        $scope.inviteUsers = function(){
            //console.log('inviting frens');
            //console.log($scope.selectedFriends);
                for(var j = 0; j< $scope.selectedFriends.length;j++) {
                    if($scope.selectedFriends[j] !== undefined){
                        $scope.event.invites = $scope.event.invites.concat($scope.selectedFriends[j]._id);
                    }

                }
            $scope.event.invites = $scope.event.invites.unique();
            //console.log($scope.event.invites);

            $http.post("/api/events/update",{'event':$scope.event,'type':'updateInvites'}).success(function(resp){
                    //console.log(resp);
                    $state.go("settings.accepted");
                })
                .error(function(err){console.log(err);});
        };

        $scope.iAll=false;

        $scope.inviteAll = function(){
            var ele = document.getElementById('iCheckBtn');
            var ele1 = document.getElementById('iaf');

            if(!$scope.iAll) {
                //console.log('inviting all frens');
                ele.setAttribute('style', 'color:black;font-size: 18px;');
                ele1.setAttribute('style', "text-decoration: line-through;");
                $scope.iAll = true;

                $http.get('/api/users/friends/list').then(function(s){
                    for(var i =0;i< s.data.length;i++){
                        //console.log(s.data[i].friend);
                        //$scope.selectedfriends.push(s.data[i].friend);
                        if(Authentication.user.email !== s.data[i].friend.email){
                            $scope.selectFriend(s.data[i].friend);
                        }

                    }

                    //console.log($scope.selectedFriends);
                },function(e){

                });

            }
            else{
                ele.setAttribute('style', 'color:#EE7322;font-size: 18px;');
                ele1.removeAttribute("style");
                $scope.iAll = false;
                $scope.selectedFriends=[];



            }
        }

    }
]);
