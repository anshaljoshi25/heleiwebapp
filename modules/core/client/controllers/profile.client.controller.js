/**
 * Created by arunsharma on 2/2/16.
 */

'use strict';

angular.module('core').controller('ProfileController', ['$scope','$timeout','$http', '$state', 'Authentication','uiGmapGoogleMapApi','uiGmapIsReady','MarkerCreatorService','Users',
    function ($scope, $timeout, $http, $state, Authentication, uiGmapGoogleMapApi, uiGmapIsReady, MarkerCreatorService,Users) {

        console.log(Authentication.user);
    if(Authentication.user == '') {
        console.log('signin..');
        $state.go('authentication.signin');
        //window.location.href='/authentication/signin';
    }

}]);
