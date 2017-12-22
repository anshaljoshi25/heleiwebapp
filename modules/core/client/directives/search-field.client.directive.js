'use strict';

angular.module('core')
.directive('searchField',['$rootScope','$timeout',"$http","Authentication",function($rootScope,$timeout,$http,Authentication){

    return {
        restrict:'E',
        replace:true,
        scope: {
            searchval: '=ngModel',
            searchToggleFunc: '&'
        },
        templateUrl:'/modules/core/client/views/search-field.client.view.html',
        link : function(scope,element,attr) {
            if($rootScope.searchFieldId===undefined) {
                $rootScope.searchFieldId = 1;
            } else {
                $rootScope.searchFieldId += 1;
            }
            scope.id = $rootScope.searchFieldId;
            scope.toggle = false;
            scope.toggleField = function() {
                scope.toggle = !scope.toggle;
                if(scope.toggle){
                    $("#searchFieldWrapper"+scope.id+" a i").removeClass("glyphicon-search");
                    $("#searchFieldWrapper"+scope.id+" a i").addClass("glyphicon-remove");
                    $("#searchFieldWrapper"+scope.id+" .form-control").addClass("animate");
                } else {
                    $("#searchFieldWrapper"+scope.id+" a i").removeClass("glyphicon-remove");
                    $("#searchFieldWrapper"+scope.id+" a i").addClass("glyphicon-search");
                    $("#searchFieldWrapper"+scope.id+" .form-control").removeClass("animate");
                }
                if(scope.searchToggleFunc!==undefined) {
                    scope.searchToggleFunc();
                }
            }
        }

    };


}]);
