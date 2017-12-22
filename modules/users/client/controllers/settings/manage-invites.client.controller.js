'use strict';

angular.module('users').controller('ManageInvitesController', ['$scope', '$http', '$location', 'Users', 'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;

    //checkState
    $scope.checkState();

    // manage invites
    $scope.invites = [];
    // get invites
    $http.get("/api/events/invites").then(function(res){
      $scope.invites = res.data;
    },function(err){});

    $scope.acceptEvent = function(ie) {
      $http.post('/api/events/invites/accept/',ie).then(function(res){
        $scope.invites = res.data;
      },function(err){});
    };

    $scope.declineEvent = function(ie) {
      $http.post('/api/events/invites/decline',ie).then(function(res){
        $scope.invites = res.data;
      },function(err){});
    }
  }
]);
