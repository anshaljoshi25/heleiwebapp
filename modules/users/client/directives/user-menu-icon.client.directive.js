/**
 * Created by arunsharma on 12/2/16.
 */
'use strict';

angular.module('users').directive('userMenuIcon',['Authentication',function(Authentication){
    return {
        restrict : 'E',
        replace : true,
        scope: true,
        templateUrl : '/modules/users/client/views/user-menu-icon.client.view.html',
        link : function(scope, elements, attrs) {
            // check if need to enable drop down menu
            scope.enablemenu = attrs.enablemenu;

            scope.authentication = Authentication;

        }
    };
}]);
