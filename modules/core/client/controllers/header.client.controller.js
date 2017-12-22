'use strict';

angular.module('core').controller('HeaderController', ['$rootScope','$scope', '$state','$http','$window','$cookies', '$timeout', 'Authentication', 'Menus',
  function ($rootScope,$scope, $state,$http,$window,$cookies, $timeout, Authentication, Menus) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;
    $scope.showSlideMenu = false;
    $scope.showQuickMenu = false;
    $scope.user = $scope.authentication.user;


    //get user
    $http.get("/api/users/me").then(function(s){
      $scope.user = s.data;
    },function(e){});

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      //get user
      $http.get("/api/users/me").then(function(s){
        $scope.user = s.data;
      },function(e){});
      $scope.isCollapsed = false;
    });

    $scope.icons = {
      'settings' : '/modules/core/client/img/settings-icon.png',
      'home' : '/modules/core/client/img/home-icon.png',
      'filter' : '/modules/core/client/img/filter-icon.png',
      'events_create' : '/modules/core/client/img/create-icon.png',
      'search':'/modules/core/client/img/search-icon.png'
    };

    $scope.hoverIcons = {
      'settings' : '/modules/core/client/img/settings-icon-hover.png',
      'home' : '/modules/core/client/img/home-icon-hover.png',
      'filter' : '/modules/core/client/img/filter-icon-hover.png',
      'events_create' : '/modules/core/client/img/create-icon-hover.png',
      'search' : '/modules/core/client/img/search-icon-hover.png'
    };



    $timeout(function(){
      changeStateIcon($state.current);
    },1);


    //menu - horizontal
    $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams, options){

      $("#menu-home img").attr("src",$scope.icons.home);
      $("#menu-settings img").attr("src",$scope.icons.settings);
      $("#menu-filter img").attr("src",$scope.icons.filter);
      $("#menu-events-create img").attr("src",$scope.icons.events_create);
      $("#menu-search img").attr("src",$scope.icons.search);

      if(toState.name=='settings.notifications') {
        $http.post('/api/users/notifications/clear',{'type':'all'}).then(function(s){
          $scope.user = s.data;
        },function(e){});
        $("#menu-settings").attr("href","/settings/profile");
      }
      if(toState.name=='inbox.list') {
        $http.post('/api/users/notifications/clear',{'type':'message'}).then(function(s){
          //console.log('state changes to inbox ---------->>');

          $scope.refreshUserData();
        },function(e){});
      }

      $scope.refreshUserData();
      changeStateIcon(toState);

    });

    $scope.refreshUserData = function(){
      if(Authentication.user !== undefined && Authentication.user !== "" && Authentication.user!==null) {
        $http.post('/api/users/notifications/count').then(function (s) {
          //console.log('updating notif count ---------->>');
          $scope.user = s.data;
          //console.log($scope.user);
          //$scope.fetcherCounter3 = $timeout($scope.refreshUserData, 1000);
        }, function (e) {
          console.log(e);
        });
      }
    };



    var changeStateIcon = function(toState) {
      if(toState.name == 'home') {
        $("#menu-home img").attr("src",$scope.hoverIcons.home);
      } else if(toState.name.startsWith('settings')){
        $("#menu-settings img").attr("src",$scope.hoverIcons.settings);
      } else if(toState.name == 'filter') {
        $("#menu-filter img").attr("src",$scope.hoverIcons.filter);
      } else if(toState.name == 'events.create') {
        $("#menu-events-create img").attr("src",$scope.hoverIcons.events_create);
      } else if(toState.name == 'search') {
        $("#menu-search img").attr("src",$scope.hoverIcons.search);
      }
    };


    //vertical

    $scope.showHideMenu = function($event) {
      if($event!==undefined && $event!=="" && $event!==null) {
        var cn = $event.target.className;
        if(cn+"" === "thick-box") {
          $scope.showSlideMenu = false;
        }
      } else {
        $scope.showSlideMenu = !$scope.showSlideMenu;
      }

    };

    $rootScope.distance = function (lat1, lon1, lat2, lon2, unit) {
      var radlat1 = Math.PI * lat1 / 180;
      var radlat2 = Math.PI * lat2 / 180;
      var theta = lon1 - lon2;
      var radtheta = Math.PI * theta / 180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "K") {
        dist = dist * 1.609344;
      }
      if (unit == "N") {
        dist = dist * 0.8684;
      }
      return dist;
    };

    // check if gps is on or not
    var checkGPS = function(){
      navigator.geolocation.getCurrentPosition(function(){
        console.log("GPS is ON!");
      }, function(){
        $("#gpsModal").modal('show');

      }, {maximumAge: 60000});
    };
    checkGPS();

    $(".slide-menu a").click(function(){
      $scope.showSlideMenu = false;
    });

    var slides = $('.instructions-wrapper .item').length;
    var curr = 0;
    $scope.instSlide = function(dir) {
      if(dir==='left') {
        if(curr<=1) {
          curr = slides;
        } else {
          curr--;
        }
      } else {
        if(curr>=slides) {
          curr=1;
        } else {
          curr++;
        }
      }
      $('.instructions-wrapper .item').removeClass('active');
      $('.instructions-wrapper .item:nth-child('+curr+')').addClass('active');
    };

    function setCookie(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + (exdays*24*60*60*1000));
      var expires = "expires="+ d.toUTCString();
      document.cookie = cname + "=" + cvalue + "; " + expires;
    }

    function getCookie(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(';');
      for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length,c.length);
        }
      }
      return "";
    }
    $scope.skipIntroKV = false;
    $scope.skipIntro = function(){
      $(".instructions-wrapper").hide();
      setCookie('introSkip','true',365);
      $scope.skipIntroKV=true;
    };
    $scope.showIntro = function() {
      $scope.instSlide('right');
      $(".instructions-wrapper").show();
      $scope.skipIntroKV=false;
    };
    if(getCookie('introSkip')!=='true') {
      $scope.instSlide('right');
    } else {
      $scope.skipIntroKV=true;
    }
    
  }
  ]);
