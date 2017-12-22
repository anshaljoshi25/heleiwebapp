'use strict';

angular.module('users').controller('ManageAcceptedController', ['$scope','$window', '$http', '$location', 'Users', 'Authentication','$state',
  function ($scope,$window, $http, $location, Users, Authentication,$state) {
    $scope.user = Authentication.user;

    //checkState
    $scope.checkState();
    $scope.me = Authentication.user;

    // manage invites
    $scope.accepted = [];
    $scope.predicate = 'eventDate';
    $scope.currentSort = 'eventDate';
    $scope.sortBy = function(s) {
      $scope.currentSort=s;
    };
    // get accepted
    $http.get("/api/events/accepted").then(function(res){
      $scope.accepted = res.data;
      //console.log($scope.accepted);
    },function(err){});

    $scope.declineEvent = function(ae) {
      var confirm = $window.confirm("To un-subscribe the event, please confirm by pressing OK");
      if(!confirm) {
        return;
      }
      $http.post('/api/events/accepted/decline',ae).then(function(res){
        $scope.accepted = res.data;
      },function(err){
        console.log(err);
      });
    };

    $scope.editEvent = function (event) {
      //console.log('edit event'+event._id);
      $state.go('events.edit',{eid : event._id})
    };
    $scope.inviteFrens = function(event){

      $state.go('events.invite',{eid:event._id});
    };
  }
]);
