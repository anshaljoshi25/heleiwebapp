'use strict';

angular.module('users').controller('ManageNotificationsController', ['$scope','$window', '$http', '$location', 'Users', 'Authentication',
  function ($scope,$window, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;

    //checkState
    $scope.checkState();
    $scope.notifications =[];
    $http.get('/api/users/notifications').then(function(s){
      //console.log(s.data);
      for(var i = 0; i < s.data.length; i++) {
        if (s.data[i].actor === null || s.data[i].actor === undefined ) {
          s.data[i].actor = {
            profileImageURL: 'modules/inbox/client/images/groupchat.png'
          }
        }
      }
      $scope.notifications = s.data;

    },function(e){

    });

    $scope.archiveNotif = function(n){
      //console.log(n._id);
      $http.post('/api/users/notifications/archive',{
        'n': n._id
      }).then(function success(res){

        //console.log(res);
        //$scope.notifications
        for(var i=0;i<$scope.notifications.length;i++)
        {
          if($scope.notifications[i]._id === n._id){
            $scope.notifications.splice(i,1);
            i--;
            //console.log('removed');
          }
        }

      },function error(err) {
        console.log(err);
      });

    };
  }
]);
