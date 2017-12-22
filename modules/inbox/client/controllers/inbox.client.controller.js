/**
 * Created by pardeep on 2/4/16.
 */

'use strict';

angular.module('inbox').controller('InboxController', ['$scope','$timeout','$http', '$state', 'Authentication','Users',
    function ($scope, $timeout, $http, $state, Authentication, Users) {

        $scope.lastState = $state.previous.state.name;
        if($scope.lastState===undefined || $scope.lastState==='') {
            $scope.lastState = 'settings.profile';
        }

    }
]);
angular.module('inbox').filter('parseDate', function($filter) {
    return function(input) {
        if(input == null){ return ""; }

        var _date = $filter('date')(new Date(input), 'MMM dd yyyy - HH:mm:ss');

        return _date.toLowerCase();

    };
});
