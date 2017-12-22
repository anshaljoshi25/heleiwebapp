/**
 * Created by pardeep on 3/4/16.
 */


 angular.module('users').controller('UserProfileHomeController', ['$scope', '$stateParams', '$http','$timeout','$interval', '$location', 'Authentication','$state',
    function ($scope, $stateParams, $http,$timeout,$interval, $location, Authentication, $state) {


        $scope.userId = $stateParams.uid;
        $scope.city = "Mayaguez";
        $scope.country = "Puerto Rico";
        $scope.me = Authentication.user;
        if($stateParams.ptype === "single"){
            $http.get('/api/users/profile/' + $stateParams.uid).then(function success(res) {
                $scope.profile = res.data;
            }, function error(err) {
                console.log(err);
            });
        }
        else if($stateParams.ptype === "group"){
            $http.post('/api/inbox/friend/group', {'groupId':$stateParams.uid}).then(function success(res) {
                $scope.profile = res.data;
                //console.log($scope.profile);
                //$scope.loadEvents();

            }, function error(err) {
                console.log(err);

            });
        }
        else{
            console.log('bad req');

        }

        $http.get('/api/users/friends/list',{params:{id:$stateParams.uid}}).then(function(s){
            $scope.allFriends = s.data;
            // $scope.cfr = countFriendRequests($scope.friends);
        },function(e){

        });

        $scope.newWallImage= undefined;



        

        $scope.showEventPage = function(obj){
            // console.log(obj);
            $state.go('events.show',{eid : obj._id});
        };

        $scope.showFriendProfile = function(obj){
            //console.log(obj);
            $state.go('user.profile',{uid : obj._id,ptype:'single'});
        };

        $scope.goBack = function(){
         $state.go('settings.profile');
     };



     $scope.m = undefined ;
     $scope.$watch("newWallImage", function(newValue, oldValue) {
        if ($scope.newWallImage !== undefined) {
                // console.log('changing walllImg and m to false;');
                $scope.profile.wallImageURL = $scope.newWallImage ;
                $scope.uploader.queue=0;
                $scope.m = false;

            }
        });
     $scope.updateWallImage = function() {
        window.location.reload();
    };
    $scope.showUploadModal = function() {
        $('#wallModal').modal('show');
    };
    $scope.showFUdirective = function () {

        if ($scope.m === false || $scope.m === undefined) {
            $scope.m = true;

                // console.log('putting true');
            }
            else {
                $scope.newWallImage = undefined;
                $scope.m = false;
                // console.log('putting false');
            }


        };

    }
    ]);
