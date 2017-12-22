/**
 * Created by pardeep on 2/4/16.
 */
'use strict';

angular.module('inbox').controller('InboxListController', ['$scope','$timeout','$http', '$state', 'Authentication','Users',
    function ($scope, $timeout, $http, $state, Authentication, Users) {

        $scope.profile = [];
        $scope.groupProfile = [];
        //console.log(Authentication.user);
        $scope.renderUserProfile={
            '_id': '',
            'displayname':'',
            'email':'',
            profileImageURL : '',
            firstName : '',
            lastName : '',
            lastMsgSentAt:'',
            rmsg : ''

        };
        $scope.renderGroup1 = {
            '_id': '',
            'displayname':'',
            'email':'',
            profileImageURL : '',
            firstName : '',
            lastName : '',
            lastMsgSentAt:'',
            rmsg : ''

        };
        $scope.goBack = function() {
            $state.go('settings.profile');
        };
        $http.get('/api/inbox/friend/list').then(function success(res){
                if(res.data.length>0){
                    //$scope.profile = $scope.profile.concat(res.data);
                    //console.log($scope.profile);
                    for (var j = 0; j < res.data.length; j++) {
                        $scope.renderUserProfile={
                            '_id': '',
                            'displayname':'',
                            'email':'',
                            profileImageURL : '',
                            firstName : '',
                            lastName : '',
                            lastMsgSentAt:''

                        };
                        $scope.renderUserProfile._id = res.data[j]._id;
                        $scope.renderUserProfile.displayname =res.data[j].displayName;
                        //console.log($scope.renderGroup1.displayname);
                        $scope.renderUserProfile.email = res.data[j].email;
                        $scope.renderUserProfile.profileImageURL = res.data[j].profileImageURL;
                        $scope.renderUserProfile.firstName = res.data[j].firstName;
                        $scope.renderUserProfile.lastName = res.data[j].lastName;
                        $scope.getLastMsgCreatedDate($scope.renderUserProfile,'single');
                        $scope.profile = $scope.profile.concat($scope.renderUserProfile);
                        //$scope.profile.push($scope.renderGroup1);



                    }
                    //console.log($scope.profile);
                }


            }, function error(err){
                console.log(err);
        });



        $http.get('/api/inbox/friend/group').then(function success(res){

            $scope.groupProfile = res.data;

            //console.log($scope.groupProfile);
            //$scope.profile.push(res.data);
            if($scope.groupProfile) {
                for (var j = 0; j < $scope.groupProfile.length; j++) {
                    $scope.renderGroup1 = {
                        '_id': '',
                        'displayname':'',
                        'email':'',
                        profileImageURL : '',
                        firstName : '',
                        lastName : '',
                        lastMsgSentAt:''

                    };

                    $scope.renderGroup1._id = $scope.groupProfile[j]._id;
                    $scope.renderGroup1.displayname = $scope.groupProfile[j].name;
                    //console.log($scope.renderGroup1.displayname);
                    $scope.renderGroup1.email = "";
                    $scope.renderGroup1.profileImageURL = $scope.groupProfile[j].groupImgURL;
                    $scope.renderGroup1.firstName = $scope.groupProfile[j].name;
                    $scope.renderGroup1.lastName = 'Group';
                    $scope.getLastMsgCreatedDate($scope.renderGroup1,'group');
                    $scope.profile = $scope.profile.concat($scope.renderGroup1);
                    //$scope.profile.push($scope.renderGroup1);
                    //console.log($scope.profile);


                }
            }
            //console.log($scope.profile);


            }, function error(err){
            console.log(err);
        });

        $scope.getLastMsgCreatedDate = function(profile,type) {
            if(type === 'single') {
                $http.post('/api/inbox/conversation/receiverecentchat', {'userId': profile._id,'type':type})
                    .then(function success(res) {

                        if (res.data !== null) {
                            //console.log(res.data.created);
                            profile.lastMsgSentAt = res.data.created;
                            //console.log("done");
                            profile.rmsg = res.data.message;
                            if(profile.rmsg.length > 20){
                                profile.rmsg = profile.rmsg.substring(0,20)+ "...";
                            }
                        }

                    }, function error(err) {

                    });
            }
            if(type === 'group') {
                $http.post('/api/inbox/conversation/receiverecentchat', {'userId': profile._id,'type':type})
                    .then(function success(res) {

                        if (res.data !== null) {
                            //console.log(res.data.created);
                            profile.lastMsgSentAt = res.data.created;
                            //console.log("done");
                            profile.rmsg = res.data.message;
                            if(profile.rmsg.length > 20){
                                profile.rmsg = profile.rmsg.substring(0,20)+ "...";
                            }

                        }

                    }, function error(err) {

                    });
            }
        };

        $scope.showProfile = function(obj) {
            $state.go('inbox.conversation',{uid : obj._id});
        };

        /*
        * options list on inbox user list*/

        $scope.deletChat= function(){

            console.log('delete chat for');

        };

    }
]);

