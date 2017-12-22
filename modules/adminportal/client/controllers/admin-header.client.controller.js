/**
 * Created by anshal on 02-05-16.
 */
'use strict';

angular.module('adminportal').controller('AdminHeaderController', ['$scope', '$state', 'Authentication', 'Menus',
    function ($scope, $state, Authentication, Menus) {
        // Expose view variables
        $scope.$state = $state;
        $scope.authentication = Authentication;
        $scope.menuVisible=false;

        $scope.showMenu=function(){
            $scope.menuVisible=!$scope.menuVisible;
        };
        $("#adMenu a").click(function(){
            $scope.menuVisible=false;
        });

        $scope.eventHolder = {
            name: '',
            eventStartDate : '',
            eventEndDate : '',
            category : '',
            location : '',
            creator :'',
            description : '',
            invites :'',
            public : '',
            eventDisplayPic : '',
            venueName:''

        };

    $scope.loadFBEvents = function() {
        console.log('we are trying');
        window.fbAsyncInit = function () {
            FB.init({
                appId: '202155666826440',
                xfbml: true,
                version: 'v2.5'
            });
            FB.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                    console.log('we are connected');
                    getInfo();
                } else if (response.status === 'not_authorized') {
                    console.log('we are not authorized');
                    login();
                } else {
                    console.log('we are not connected');
                    login();
                }
            });
        };
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        function login() {
            FB.login(function (response) {
                if (response.status === 'connected') {
                    console.log('we are connected');
                    getInfo();
                } else if (response.status === 'not_authorized') {
                    console.log('we are not logged in');
                } else {
                    console.log('we are not connected');
                }
            }, {scope: 'email'});
        }

        function getInfo() {
            FB.api('/1728666710710082/events', 'GET', function (response) {
                console.log(response.id);
            });

            FB.api('/me', 'GET', {fields: 'events'}, function (response) {
                console.log(response);
            });
        }


    };
    }
]);
