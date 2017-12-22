/**
 * Created by anshal on 02-05-16.
 */
'use strict';

angular.module('adminportal').controller('AdminHomeController', ['$scope','$timeout','$http', 'Authentication','uiGmapGoogleMapApi','uiGmapIsReady','MarkerCreatorService','Users','$state',
    function ($scope, $timeout, $http, Authentication, uiGmapGoogleMapApi, uiGmapIsReady, MarkerCreatorService,Users,$state) {
        // This provides Authentication context.

        $scope.authentication = Authentication;
        $scope.user = Authentication.user;
        $scope.sname=$state.current.name;
        //console.log($state.current.name);
        //$(document).click(function (event) {
        //    var clickover = $(event.target);
        //    var $navbar = $(".navbar-collapse");
        //    var _opened = $navbar.hasClass("in");
        //    if (_opened === true && !clickover.hasClass("navbar-toggle")) {
        //        $navbar.collapse('hide');
        //    }
        //});

        $(document).ready(function(){
            $("#hide").click(function(){
                console.log($('#dd-list').css('display'));
                if($('#dd-list').css('display')=='none'){
                    console.log('showing');
                    $("#dd-list").show();
                }else{
                    console.log('hiding');
                    $("#dd-list").hide();
                }
            });
            $("#dd-list").click(function(){
                $("#dd-list").hide();
            });
        });
    }
]);
