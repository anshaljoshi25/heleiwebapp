/**
 * Created by arunsharma on 3/2/16.
 */
'use strict';
angular.module('events').filter('toSec', function ($filter) {
    return function (input) {
        var result = Date.parse(input);
        return result || '';
    };
});

angular.module('events').filter('toDate', function ($filter) {
    return function (input) {
        var mnthArr = ['NA','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var result = mnthArr[parseInt(input)];
        return result || '';
    };
});
angular.module('events').controller('EventsController', ['$scope','$timeout','$http', '$state', 'Authentication','Users',
    function ($scope, $timeout, $http, $state, Authentication, Users) {


    }
    ]);
