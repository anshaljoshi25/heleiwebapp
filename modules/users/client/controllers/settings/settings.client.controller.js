'use strict';

angular.module('users').controller('SettingsController', ['$scope','$rootScope', '$state','$http','$timeout', '$interval', 'Authentication',
  function ($scope,$rootScope, $state,$http,$timeout, $interval, Authentication) {
    $scope.user = Authentication.user;
    $http.get('/api/users/me').then(function(s){
      $scope.user = s.data;

      $http.get('/api/loyalties/loyalty/get').then(function(s){
        if(!s.data.hasOwnProperty('status')) {
          $scope.loyalty = s.data;
        } else {
          $scope.loyalty = {points: ""};
        }
      },function(e){});

    },function(e){});
    $scope.checkState = function() {


      var _nid = $state.current.name.replace(".","");


      $(".sub-menu-container-wrapper a").removeClass("selected-sub-menu");
      $("#"+_nid).addClass("selected-sub-menu");
      //var sl = menuItemsOffestArray[_nid];
      var sl = $("#"+_nid).offset().left - $(".sub-menu-container").offset().left;
      var currPos = $(".sub-menu-container").scrollLeft();
      $(".sub-menu-container").scrollLeft(currPos + sl);

    };

    $scope.checkState();




    $scope.intervalCounter = undefined;
    $scope.ocPos = 0;

    $scope.scrollMenuLeft = function(recursive) {
      var currPos = $(".sub-menu-container").scrollLeft();
      var menuWidth = $(".sub-menu-container-wrapper").width();
      if(currPos <=0) {
        currPos = 0;
      } else {
        $(".sub-menu-container").animate({
          scrollLeft: currPos - 100
        },200);
      }


    };



    $scope.scrollMenuRight = function(recursive) {
      var currPos = $(".sub-menu-container").scrollLeft();

      var menuWidth = $(".sub-menu-container-wrapper").width();
      if(currPos >=menuWidth) {
        currPos = menuWidth;
      } else {
        $(".sub-menu-container").animate({
          scrollLeft: currPos + 100
        },200);
      }


    };

  }
]);
