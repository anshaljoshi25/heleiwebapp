'use strict';

angular.module('users').controller('ManageFriendsController', ['$scope','$window', '$http', '$location', 'Users', 'Authentication',
  function ($scope,$window, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;
    $scope.cfr = 0;
    //checkState
    $scope.checkState();
    $http.get('/api/users/me').then(function(s){
      $scope.user = s.data;
      $http.get('/api/users/friends/list').then(function(s){
        $scope.friends = s.data;
        $scope.cfr = countFriendRequests($scope.friends);
      },function(e){

      });
    },function(e){

    });
    var countFriendRequests = function(fs) {
      var count = 0;
      for(var i=0;i<fs.length;i++) {
        if(fs[i].status==='0'){
          count+=1;
        }
      }
      return count;
    };
    $scope.accept = function(f) {
      $http.post('/api/users/friends/accept/'+ f._id).then(function(s){
        $scope.friends = s.data;
        $scope.cfr = countFriendRequests($scope.friends);
      },function(e){

      });
    };

    $scope.decline = function(f) {
      var c = $window.confirm("Press OK to decline request.");
      if(!c) {
        return;
      }
      $http.post('/api/users/friends/remove',f).then(function(s){
        $scope.friends = s.data;
        $scope.cfr = countFriendRequests($scope.friends);
      },function(e){

      });
    };

  }
]);
